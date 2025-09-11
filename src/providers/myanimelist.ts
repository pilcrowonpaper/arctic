import { OAuth2Client, CodeChallengeMethod } from "../client.js";
import type { OAuth2Provider, OAuth2AuthorizationOptions, OAuth2ValidationOptions } from "../provider.js";

import type { OAuth2Tokens } from "../oauth2.js";

const authorizationEndpoint = "https://myanimelist.net/v1/oauth2/authorize";
const tokenEndpoint = "https://myanimelist.net/v1/oauth2/token";

export class MyAnimeList implements OAuth2Provider<["state", "codeVerifier"], ["code", "codeVerifier"]> {
	private client;

	constructor(clientId: string, clientSecret: string, redirectURI: string | null) {
		this.client = new OAuth2Client(clientId, clientSecret, redirectURI);
	}

	public createAuthorizationURL(options: Pick<OAuth2AuthorizationOptions, "state" | "codeVerifier">): URL {
		const { state, codeVerifier } = options;
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
		options: Pick<OAuth2ValidationOptions, "code" | "codeVerifier">
	): Promise<OAuth2Tokens> {
		const { code, codeVerifier } = options;
		const tokens = await this.client.validateAuthorizationCode(tokenEndpoint, code, codeVerifier);
		return tokens;
	}

	public async refreshAccessToken(refreshToken: string): Promise<OAuth2Tokens> {
		const tokens = await this.client.refreshAccessToken(tokenEndpoint, refreshToken, []);
		return tokens;
	}
}
