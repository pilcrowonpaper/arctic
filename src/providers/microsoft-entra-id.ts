import { CodeChallengeMethod, OAuth2Client } from "../client.js";

import type { OAuth2Tokens } from "../oauth2.js";
import { joinURIAndPath } from "../request.js";

export class MicrosoftEntraId {
	private authorizationEndpoint: string;
	private tokenEndpoint: string;

	private client: OAuth2Client;

	constructor(tenant: string, clientId: string, clientSecret: string, redirectURI: string) {
		this.authorizationEndpoint = joinURIAndPath(
			"https://login.microsoftonline.com",
			tenant,
			"/oauth2/v2.0/authorize"
		);
		this.tokenEndpoint = joinURIAndPath(
			"https://login.microsoftonline.com",
			tenant,
			"/oauth2/v2.0/token"
		);
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
}
