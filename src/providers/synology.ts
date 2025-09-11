import { CodeChallengeMethod, OAuth2Client } from "../client.js";
import { joinURIAndPath } from "../request.js";
import type { OAuth2Provider, OAuth2AuthorizationOptions, OAuth2ValidationOptions } from "../provider.js";

import type { OAuth2Tokens } from "../oauth2.js";

export class Synology implements OAuth2Provider<["state", "codeVerifier", "scopes"], ["code", "codeVerifier"]> {
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

	public createAuthorizationURL(options: Pick<OAuth2AuthorizationOptions, "state" | "codeVerifier" | "scopes">): URL {
		const { state, codeVerifier, scopes = [] } = options;
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
		options: Pick<OAuth2ValidationOptions, "code" | "codeVerifier">
	): Promise<OAuth2Tokens> {
		const { code, codeVerifier } = options;
		const tokens = await this.client.validateAuthorizationCode(
			this.tokenEndpoint,
			code,
			codeVerifier
		);
		return tokens;
	}
}
