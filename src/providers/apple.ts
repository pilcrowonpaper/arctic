import {
	AuthorizationCodeAuthorizationURL,
	AuthorizationCodeTokenRequestContext,
	RefreshRequestContext
} from "@oslojs/oauth2";
import { sendTokenRequest } from "../request.js";
import { base64url } from "@oslojs/encoding";

import type { OAuth2Tokens } from "../oauth2.js";

const authorizationEndpoint = "https://appleid.apple.com/auth/authorize";
const tokenEndpoint = "https://appleid.apple.com/auth/token";

export class Apple {
	private clientId: string;
	private teamId: string;
	private keyId: string;
	private pkcs8PrivateKey: Uint8Array;
	private redirectURI: string;

	constructor(
		clientId: string,
		teamId: string,
		keyId: string,
		pkcs8PrivateKey: Uint8Array,
		redirectURI: string
	) {
		this.clientId = clientId;
		this.teamId = teamId;
		this.keyId = keyId;
		this.pkcs8PrivateKey = pkcs8PrivateKey;
		this.redirectURI = redirectURI;
	}

	public createAuthorizationURL(state: string): AuthorizationCodeAuthorizationURL {
		const url = new AuthorizationCodeAuthorizationURL(authorizationEndpoint, this.clientId);
		url.setState(state);
		url.setRedirectURI(this.redirectURI);
		return url;
	}

	public async validateAuthorizationCode(code: string): Promise<OAuth2Tokens> {
		const context = new AuthorizationCodeTokenRequestContext(code);
		const secret = await this.createClientSecret();
		context.authenticateWithRequestBody(this.clientId, secret);
		context.setRedirectURI(this.redirectURI);
		const tokens = await sendTokenRequest(tokenEndpoint, context);
		return tokens;
	}

	public async refreshAccessToken(refreshToken: string): Promise<OAuth2Tokens> {
		const context = new RefreshRequestContext(refreshToken);
		const secret = await this.createClientSecret();
		context.authenticateWithRequestBody(this.clientId, secret);
		const tokens = await sendTokenRequest(tokenEndpoint, context);
		return tokens;
	}

	private async createClientSecret(): Promise<string> {
		const privateKey = await crypto.subtle.importKey(
			"pkcs8",
			this.pkcs8PrivateKey,
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
			alg: "ES256",
			kid: this.keyId
		};
		const payload = {
			iss: this.teamId,
			exp: now + 5 * 60,
			aud: ["https://appleid.apple.com"],
			sub: this.clientId,
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
