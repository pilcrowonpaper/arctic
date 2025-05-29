import { CodeChallengeMethod, OAuth2Client } from "../client.js";

import type { OAuth2Tokens } from "../oauth2.js";
import { joinURIAndPath } from "../request.js";

export class Okta {
	private authorizationEndpoint: string;
	private tokenEndpoint: string;
	private tokenRevocationEndpoint: string;

	private client: OAuth2Client;

	constructor(
		domain: string,
		authorizationServerId: string | null,
		clientId: string,
		clientSecret: string,
		redirectURI: string
	) {
		let baseURL = `https://${domain}/oauth2`;
		if (authorizationServerId !== null) {
			baseURL = joinURIAndPath(baseURL, authorizationServerId);
		}
		this.authorizationEndpoint = joinURIAndPath(baseURL, "/v1/authorize");
		this.tokenEndpoint = joinURIAndPath(baseURL, "/v1/token");
		this.tokenRevocationEndpoint = joinURIAndPath(baseURL, "/v1/revoke");
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

	public async refreshAccessToken(refreshToken: string, scopes: string[]): Promise<OAuth2Tokens> {
		const tokens = await this.client.refreshAccessToken(this.tokenEndpoint, refreshToken, scopes);
		return tokens;
	}

	public async revokeToken(token: string): Promise<void> {
		await this.client.revokeToken(this.tokenRevocationEndpoint, token);
	}
}
