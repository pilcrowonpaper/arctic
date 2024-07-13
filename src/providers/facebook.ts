import { createOAuth2Request, sendTokenRequest } from "../request.js";

import type { OAuth2Tokens } from "../oauth2.js";

const authorizationEndpoint = "https://www.facebook.com/v16.0/dialog/oauth";
const tokenEndpoint = "https://graph.facebook.com/v16.0/oauth/access_token";

export class Facebook {
	private clientId: string;
	private clientSecret: string;
	private redirectURI: string;

	constructor(clientId: string, clientSecret: string, redirectURI: string) {
		this.clientId = clientId;
		this.clientSecret = clientSecret;
		this.redirectURI = redirectURI;
	}

	public createAuthorizationURL(state: string, scopes: string[]): URL {
		const url = new URL(authorizationEndpoint);
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
		body.set("client_secret", this.clientSecret);
		const request = createOAuth2Request(tokenEndpoint, body);
		const tokens = await sendTokenRequest(request);
		return tokens;
	}
}
