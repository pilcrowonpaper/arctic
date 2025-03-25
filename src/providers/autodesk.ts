import { CodeChallengeMethod, OAuth2Client } from "../client.js";

import type { OAuth2Tokens } from "../oauth2.js";

const authorizationEndpoint = "https://developer.api.autodesk.com/authentication/v2/authorize";
const tokenEndpoint = "https://developer.api.autodesk.com/authentication/v2/token";
const tokenRevocationEndpoint = "https://developer.api.autodesk.com/authentication/v2/revoke";

export class Autodesk {
	private client: OAuth2Client;

	constructor(clientId: string, clientSecret: string | null, redirectURI: string) {
		this.client = new OAuth2Client(clientId, clientSecret, redirectURI);
	}

	public createAuthorizationURL(state: string, codeVerifier: string, scopes: string[]): URL {
		const url = this.client.createAuthorizationURLWithPKCE(
			authorizationEndpoint,
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
		const tokens = await this.client.validateAuthorizationCode(tokenEndpoint, code, codeVerifier);
		return tokens;
	}

	public async refreshAccessToken(refreshToken: string): Promise<OAuth2Tokens> {
		const tokens = await this.client.refreshAccessToken(tokenEndpoint, refreshToken, []);
		return tokens;
	}

	public async revokeToken(token: string): Promise<void> {
		await this.client.revokeToken(tokenRevocationEndpoint, token);
	}
}
