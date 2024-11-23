import { CodeChallengeMethod, OAuth2Client } from "../client.js";

import type { OAuth2Tokens } from "../oauth2.js";

export class KeyCloak {
	private authorizationEndpoint: string;
	private tokenEndpoint: string;
	private tokenRevocationEndpoint: string;

	private client: OAuth2Client;

	constructor(realmURL: string, clientId: string, clientSecret: string, redirectURI: string) {
		this.authorizationEndpoint = realmURL + "/protocol/openid-connect/auth";
		this.tokenEndpoint = realmURL + "/protocol/openid-connect/token";
		this.tokenRevocationEndpoint = realmURL + "/protocol/openid-connect/revoke";
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

	public async refreshAccessToken(refreshToken: string): Promise<OAuth2Tokens> {
		const tokens = await this.client.refreshAccessToken(this.tokenEndpoint, refreshToken, []);
		return tokens;
	}

	public async revokeToken(token: string): Promise<void> {
		await this.client.revokeToken(this.tokenRevocationEndpoint, token);
	}
}
