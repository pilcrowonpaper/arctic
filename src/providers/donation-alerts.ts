import { createOAuth2Request, sendTokenRequest } from "../request.js";

import type { OAuth2Tokens } from "../oauth2.js";

const authorizationEndpoint = "https://www.donationalerts.com/oauth/authorize";
const tokenEndpoint = "https://www.donationalerts.com/oauth/token";

export class DonationAlerts {
	private clientId: string;
	private clientSecret: string;
	private redirectURI: string;

	constructor(clientId: string, clientSecret: string, redirectURI: string) {
		this.clientId = clientId;
		this.clientSecret = clientSecret;
		this.redirectURI = redirectURI;
	}

	public createAuthorizationURL(scopes: string[]): URL {
		const url = new URL(authorizationEndpoint);
		url.searchParams.set("client_id", this.clientId);
		url.searchParams.set("response_type", "code");
		url.searchParams.set("redirect_uri", this.redirectURI);
		if (scopes.length > 0) {
			url.searchParams.set("scope", scopes.join(" "));
		}
		return url;
	}

	public async validateAuthorizationCode(code: string): Promise<OAuth2Tokens> {
		const body = new URLSearchParams();
		body.set("code", code);
		body.set("client_id", this.clientId);
		body.set("client_secret", this.clientSecret);
		body.set("redirect_uri", this.redirectURI);
		body.set("grant_type", "authorization_code");
		const request = createOAuth2Request(tokenEndpoint, body);
		const tokens = await sendTokenRequest(request);
		return tokens;
	}

	public async refreshAccessToken(refreshToken: string): Promise<OAuth2Tokens> {
		const body = new URLSearchParams();
		body.set("refresh_token", refreshToken);
		body.set("client_id", this.clientId);
		body.set("client_secret", this.clientSecret);
		body.set("grant_type", "refresh_token");
		const request = createOAuth2Request(tokenEndpoint, body);
		const tokens = await sendTokenRequest(request);
		return tokens;
	}
}
