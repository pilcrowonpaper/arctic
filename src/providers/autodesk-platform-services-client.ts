import { joinURIAndPath } from "../request.js";
import { CodeChallengeMethod, OAuth2Client } from "../client.js";

import type { OAuth2Tokens } from "../oauth2.js";

export class Autodesk {
	private baseUrl = "https://developer.api.autodesk.com/authentication/v2"
	private client: OAuth2Client
	private authorizationEndpoint: string
	private tokenEndpoint: string;
	private tokenRevocationEndpoint: string;

	constructor(clientId: string, clientSecret: string | null, redirectURI: string) {
		this.client = new OAuth2Client(clientId, clientSecret, redirectURI)
		this.authorizationEndpoint = joinURIAndPath(this.baseUrl, "/authorize")
		this.tokenEndpoint = joinURIAndPath(this.baseUrl, "/token")
		this.tokenRevocationEndpoint = joinURIAndPath(this.baseUrl, "/revoke")
	}

    public createAuthorizationURL(state: string, codeVerifier: string, scopes: string[], prompt?: "login") {

		const url = this.client.createAuthorizationURLWithPKCE(
			this.authorizationEndpoint,
			state,
			CodeChallengeMethod.S256,
			codeVerifier,
			scopes
		);

		if (prompt) url.searchParams.set("prompt", prompt)

		return url;
	}

	public async validateAuthorizationCode(code: string,codeVerifier: string): Promise<OAuth2Tokens> {

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