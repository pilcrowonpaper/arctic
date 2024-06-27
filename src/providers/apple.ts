import {
	AuthorizationCodeAuthorizationURL,
	AuthorizationCodeTokenRequestContext,
	RefreshRequestContext
} from "@oslojs/oauth2";
import { sendTokenRequest } from "../request.js";

import type { OAuth2Tokens } from "../oauth2.js";
import { base64, base64url } from "@oslojs/encoding";

const authorizeEndpoint = "https://appleid.apple.com/auth/authorize";
const tokenEndpoint = "https://appleid.apple.com/auth/token";

export class Apple {
	private credentials: AppleCredentials;
	private redirectURI: string;

	constructor(credentials: AppleCredentials, redirectURI: string) {
		this.credentials = credentials;
		this.redirectURI = redirectURI;
	}

	public createAuthorizationURL(state: string): AuthorizationCodeAuthorizationURL {
		const url = new AuthorizationCodeAuthorizationURL(authorizeEndpoint, this.credentials.clientId);
		url.setState(state);
		url.setRedirectURI(this.redirectURI);
		return url;
	}

	public async validateAuthorizationCode(code: string): Promise<OAuth2Tokens> {
		const context = new AuthorizationCodeTokenRequestContext(code);
		const secret = await this.createClientSecret();
		context.authenticateWithRequestBody(this.credentials.clientId, secret);
		context.setRedirectURI(this.redirectURI);
		const tokens = await sendTokenRequest(tokenEndpoint, context);
		return tokens;
	}

	public async refreshAccessToken(refreshToken: string): Promise<OAuth2Tokens> {
		const context = new RefreshRequestContext(refreshToken);
		const secret = await this.createClientSecret();
		context.authenticateWithRequestBody(this.credentials.clientId, secret);
		const tokens = await sendTokenRequest(tokenEndpoint, context);
		return tokens;
	}

	private async createClientSecret(): Promise<string> {
		const privateKey = await crypto.subtle.importKey(
			"pkcs8",
			parsePKCS8PEM(this.credentials.certificate),
			{
				name: "ECDSA",
				namedCurve: "P-256"
			},
			false,
			["sign"]
		);
		const now = Math.floor(Date.now() / 1000);
		const header = {
			typ: "JWT",
			alg: "ES256"
		};
		const payload = {
			iss: this.credentials.teamId,
			kid: this.credentials.keyId,
			exp: now + 5 * 60,
			aud: ["https://appleid.apple.com"],
			sub: this.credentials.clientId,
			iat: now
		};
		const encodedHeader = base64url.encodeNoPadding(
			new TextEncoder().encode(JSON.stringify(header))
		);
		const encodedPayload = base64url.encodeNoPadding(
			new TextEncoder().encode(JSON.stringify(payload))
		);
		const signature = await crypto.subtle.sign(
			{
				name: "ECDSA",
				hash: "SHA-256"
			},
			privateKey,
			new TextEncoder().encode(encodedHeader + "." + encodedPayload)
		);
		const encodedSignature = base64url.encodeNoPadding(new Uint8Array(signature));
		const jwt = encodedHeader + "." + encodedPayload + "." + encodedSignature;
		return jwt;
	}
}

export interface AppleCredentials {
	clientId: string;
	teamId: string;
	keyId: string;
	certificate: string;
}

function parsePKCS8PEM(pkcs8: string): Uint8Array {
	return base64.decodeIgnorePadding(
		pkcs8
			.replace("-----BEGIN PRIVATE KEY-----", "")
			.replace("-----END PRIVATE KEY-----", "")
			.replaceAll("\r", "")
			.replaceAll("\n", "")
			.trim()
	);
}
