import { createOAuth2Request, encodeBasicCredentials, sendTokenRequest } from "../request.js";

import type { OAuth2Tokens } from "../oauth2.js";

const authorizationEndpoint = "https://www.bungie.net/en/oauth/authorize";
const tokenEndpoint = "https://www.bungie.net/platform/app/oauth/token";

export class Bungie {
	private clientId: string;
	private clientSecret: string | null;
	private redirectURI: string;

	constructor(clientId: string, clientSecret: string | null, redirectURI: string) {
		this.clientId = clientId;
		this.clientSecret = clientSecret;
		this.redirectURI = redirectURI;
	}

	public createAuthorizationURL(state: string): URL {
		const url = new URL(authorizationEndpoint);
		url.searchParams.set("response_type", "code");
		url.searchParams.set("client_id", this.clientId);
		url.searchParams.set("state", state);
		url.searchParams.set("redirect_uri", this.redirectURI);
		return url;
	}

	public async validateAuthorizationCode(code: string): Promise<OAuth2Tokens> {
		let request: Request;
		if (this.clientSecret !== null) {
			const body = new URLSearchParams();
			body.set("grant_type", "authorization_code");
			body.set("code", code);
			body.set("redirect_uri", this.redirectURI);
			request = createOAuth2Request(tokenEndpoint, body);
			const encodedCredentials = encodeBasicCredentials(this.clientId, this.clientSecret);
			request.headers.set("Authorization", `Basic ${encodedCredentials}`);
		} else {
			const body = new URLSearchParams();
			body.set("client_id", this.clientId);
			body.set("grant_type", "authorization_code");
			body.set("code", code);
			body.set("redirect_uri", this.redirectURI);
			request = createOAuth2Request(tokenEndpoint, body);
		}
		const tokens = await sendTokenRequest(request);
		return tokens;
	}

	public async refreshAccessToken(refreshToken: string): Promise<OAuth2Tokens> {
		const body = new URLSearchParams();
		body.set("grant_type", "refresh_token");
		body.set("refresh_token", refreshToken);
		const request = createOAuth2Request(tokenEndpoint, body);
		if (this.clientSecret === null) {
			throw new Error("Refresh tokens can only be used in confidential clients");
		}
		const encodedCredentials = encodeBasicCredentials(this.clientId, this.clientSecret);
		request.headers.set("Authorization", `Basic ${encodedCredentials}`);
		const tokens = await sendTokenRequest(request);
		return tokens;
	}
}
