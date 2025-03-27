import { OAuth2Client, CodeChallengeMethod } from "../client.js";
import { joinURIAndPath } from "../request.js";

import type { OAuth2Tokens } from "../oauth2.js";

export class Mastodon {
	private authorizationEndpoint: string;
	private tokenEndpoint: string;
	private tokenRevocationEndpoint: string;

	private client: OAuth2Client;

	constructor(baseURL: string, clientId: string, clientSecret: string, redirectURI: string) {
		this.authorizationEndpoint = joinURIAndPath(baseURL, "/api/v1/oauth/authorize");
		this.tokenEndpoint = joinURIAndPath(baseURL, "/api/v1/oauth/token");
		this.tokenRevocationEndpoint = joinURIAndPath(baseURL, "/api/v1/oauth/revoke");
		this.client = new OAuth2Client(clientId, clientSecret, redirectURI);
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

	public async revokeToken(token: string): Promise<void> {
		await this.client.revokeToken(this.tokenRevocationEndpoint, token);
	}
}
