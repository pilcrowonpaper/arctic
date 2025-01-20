import { CodeChallengeMethod, OAuth2Client } from "../client.js";
import { joinURIAndPath } from "../request.js";

import type { OAuth2Tokens } from "../oauth2.js";

export class Synology {
	private authorizationEndpoint: string;
	private tokenEndpoint: string;

	private client: OAuth2Client;

	constructor(
		baseURL: string,
		applicationId: string,
		applicationSecret: string,
		redirectURI: string
	) {
		this.authorizationEndpoint = joinURIAndPath(baseURL, "/webman/sso/SSOOauth.cgi");
		this.tokenEndpoint = joinURIAndPath(baseURL, "/webman/sso/SSOAccessToken.cgi");

		this.client = new OAuth2Client(applicationId, applicationSecret, redirectURI);
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
}
