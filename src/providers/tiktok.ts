import { OAuth2Client } from "../client.js";

import type { OAuth2Tokens } from "../oauth2.js";
import { createOAuth2Request, sendTokenRequest, sendTokenRevocationRequest } from "../request.js";

const authorizationEndpoint = "https://www.tiktok.com/v2/auth/authorize/";
const tokenEndpoint = "https://open.tiktokapis.com/v2/oauth/token/";
const revokeEndpoint = "https://open.tiktokapis.com/v2/oauth/revoke/";

export class TikTok {
	private clientKey: string;
	private clientSecret: string;
	private redirectURI: string;

	constructor(clientKey: string, clientSecret: string, redirectURI: string) {
		this.clientKey = clientKey;
		this.clientSecret = clientSecret;
		this.redirectURI = redirectURI;
	}

	public createAuthorizationURL(state: string, scopes: string[]): URL {
		const url = new URL(authorizationEndpoint);
		url.searchParams.set("response_type", "code");
		url.searchParams.set("client_key", this.clientKey);
		url.searchParams.set("state", state);
		url.searchParams.set("scope", scopes.join(","));
		url.searchParams.set("redirect_uri", this.redirectURI);
		return url;
	}

	public async validateAuthorizationCode(code: string): Promise<OAuth2Tokens> {
		const body = new URLSearchParams();
		body.set("grant_type", "authorization_code");
		body.set("code", code);
		body.set("redirect_uri", this.redirectURI);
		body.set("client_key", this.clientKey);
		body.set("client_secret", this.clientSecret);
		const request = createOAuth2Request(tokenEndpoint, body);
		const tokens = await sendTokenRequest(request);
		return tokens;
	}

	public async refreshAccessToken(refreshToken: string): Promise<OAuth2Tokens> {
		const body = new URLSearchParams();
		body.set("grant_type", "refresh_token");
		body.set("refresh_token", refreshToken);
		body.set("client_key", this.clientKey);
		body.set("client_secret", this.clientSecret);
		const request = createOAuth2Request(tokenEndpoint, body);
		const tokens = await sendTokenRequest(request);
		return tokens;
	}

	public async revokeToken(token: string): Promise<void> {
		const body = new URLSearchParams();
		body.set("token", token);
		body.set("client_key", this.clientKey);
		body.set("client_secret", this.clientSecret);
		const request = createOAuth2Request(revokeEndpoint, body);
		await sendTokenRevocationRequest(request);
	}
}
