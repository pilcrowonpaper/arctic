import { createOAuth2Request, sendTokenRequest } from "../request.js";
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

	public createAuthorizationURL(state: string, scopes: string[]): URL {
		const url = new URL(authorizationEndpoint);
		url.searchParams.set("response_type", "code");
		url.searchParams.set("client_id", this.clientId);
		url.searchParams.set("state", state);
		url.searchParams.set("scope", scopes.join(" "));
		url.searchParams.set("redirect_uri", this.redirectURI);
		return url;
	}

	public async validateAuthorizationCode(code: string): Promise<OAuth2Tokens> {
		const body = new URLSearchParams();
		body.set("grant_type", "authorization_code");
		body.set("code", code);
		body.set("redirect_uri", this.redirectURI);
		body.set("client_id", this.clientId);
		const clientSecret = await this.createClientSecret();
		body.set("client_secret", clientSecret);
		const request = createOAuth2Request(tokenEndpoint, body);
		const tokens = await sendTokenRequest(request);
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
