import { OAuth2Client, CodeChallengeMethod } from "../client.js";

import type { OAuth2Tokens } from "../oauth2.js";

const authorizationEndpoint = "https://myanimelist.net/v1/oauth2/authorize";
const tokenEndpoint = "https://myanimelist.net/v1/oauth2/token";

export class MyAnimeList {
	private client;

	constructor(clientId: string, clientSecret: string, redirectURI: string | null) {
		this.client = new OAuth2Client(clientId, clientSecret, redirectURI, null);
	}

	public createAuthorizationURL(state: string, codeVerifier: string): URL {
		const url = this.client.createAuthorizationURLWithPKCE(
			authorizationEndpoint,
			state,
			CodeChallengeMethod.Plain,
			codeVerifier,
			[]
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
}
