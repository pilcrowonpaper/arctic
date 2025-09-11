import { CodeChallengeMethod, OAuth2Client } from "../client.js";
import type { OAuth2Provider, OAuth2AuthorizationOptions, OAuth2ValidationOptions } from "../provider.js";

import type { OAuth2Tokens } from "../oauth2.js";

export class AmazonCognito implements OAuth2Provider<["state", "codeVerifier", "scopes"], ["code", "codeVerifier"]> {
	private authorizationEndpoint: string;
	private tokenEndpoint: string;
	private tokenRevocationEndpoint: string;

	private client: OAuth2Client;

	constructor(domain: string, clientId: string, clientSecret: string | null, redirectURI: string) {
		this.authorizationEndpoint = `https://${domain}/oauth2/authorize`;
		this.tokenEndpoint = `https://${domain}/oauth2/token`;
		this.tokenRevocationEndpoint = `https://${domain}/oauth2/revoke`;

		this.client = new OAuth2Client(clientId, clientSecret, redirectURI);
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

	public async refreshAccessToken(refreshToken: string, scopes: string[]): Promise<OAuth2Tokens> {
		const tokens = await this.client.refreshAccessToken(this.tokenEndpoint, refreshToken, scopes);
		return tokens;
	}

	public async revokeToken(token: string): Promise<void> {
		await this.client.revokeToken(this.tokenRevocationEndpoint, token);
	}
}
