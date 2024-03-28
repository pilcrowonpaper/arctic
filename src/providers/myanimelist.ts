import { TimeSpan, createDate } from "oslo";
import { OAuth2Client } from "oslo/oauth2";

import type { OAuth2ProviderWithPKCE } from "../index.js";

const authorizeEndpoint = "https://myanimelist.net/v1/oauth2/authorize";
const tokenEndpoint = "https://myanimelist.net/v1/oauth2/token";

export class MyAnimeList implements OAuth2ProviderWithPKCE {
	private client: OAuth2Client;
	private clientSecret: string;

	constructor(
		clientId: string,
		clientSecret: string,
		options?: {
			redirectURI?: string;
		}
	) {
		this.client = new OAuth2Client(clientId, authorizeEndpoint, tokenEndpoint, {
			redirectURI: options?.redirectURI
		});
		this.clientSecret = clientSecret;
	}

	public async createAuthorizationURL(state: string, codeVerifier: string): Promise<URL> {
		return await this.client.createAuthorizationURL({
			state,
			codeVerifier,
			codeChallengeMethod: "plain"
		});
	}

	public async validateAuthorizationCode(
		code: string,
		codeVerifier: string
	): Promise<MyAnimeListTokens> {
		const result = await this.client.validateAuthorizationCode<TokenResponseBody>(code, {
			credentials: this.clientSecret,
			codeVerifier
		});
		const tokens: MyAnimeListTokens = {
			accessToken: result.access_token,
			refreshToken: result.refresh_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s"))
		};
		return tokens;
	}

	public async refreshAccessToken(refreshToken: string): Promise<MyAnimeListTokens> {
		const result = await this.client.refreshAccessToken<TokenResponseBody>(refreshToken, {
			credentials: this.clientSecret
		});
		const tokens: MyAnimeListTokens = {
			accessToken: result.access_token,
			refreshToken: result.refresh_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s"))
		};
		return tokens;
	}
}

interface TokenResponseBody {
	access_token: string;
	refresh_token: string;
	expires_in: number;
}

export interface MyAnimeListTokens {
	accessToken: string;
	refreshToken: string;
	accessTokenExpiresAt: Date;
}
