import { CodeChallengeMethod, OAuth2Client } from "../client.js";
import { joinURIAndPath } from "../request.js";

import type { OAuth2Tokens } from "../oauth2.js";

export class Gitea {
	private authorizationEndpoint: string;
	private tokenEndpoint: string;

	private client: OAuth2Client;

	constructor(baseURL: string, clientId: string, clientSecret: string | null, redirectURI: string) {
		this.authorizationEndpoint = joinURIAndPath(baseURL, "/login/oauth/authorize");
		this.tokenEndpoint = joinURIAndPath(baseURL, "/login/oauth/access_token");
		this.client = new OAuth2Client(clientId, clientSecret, redirectURI, null);
	}

	public createAuthorizationURL(state: string, codeVerifier: string, scopes: string[]): URL {
		const url = this.client.createAuthorizationURLWithPKCE(
			this.authorizationEndpoint,
			state,
			CodeChallengeMethod.S256,
			codeVerifier,
			scopes
		);
		return url;
	}

	public async validateAuthorizationCode(
		code: string,
		codeVerifier: string
	): Promise<OAuth2Tokens> {
		const tokens = await this.client.validateAuthorizationCode(
			this.tokenEndpoint,
			code,
			codeVerifier
		);
		return tokens;
	}

	public async refreshAccessToken(refreshToken: string): Promise<OAuth2Tokens> {
		const tokens = await this.client.refreshAccessToken(this.tokenEndpoint, refreshToken, []);
		return tokens;
	}
}
