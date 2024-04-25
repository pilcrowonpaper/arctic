import { OAuth2Client } from "oslo/oauth2";

import type { OAuth2ProviderWithPKCE } from "../index.js";

const authorizeEndpoint = "https://twitter.com/i/oauth2/authorize";
const tokenEndpoint = "https://api.twitter.com/2/oauth2/token";

export class Twitter implements OAuth2ProviderWithPKCE {
	private client: OAuth2Client;
	private clientSecret: string;

	constructor(clientId: string, clientSecret: string, redirectURI: string) {
		this.client = new OAuth2Client(clientId, authorizeEndpoint, tokenEndpoint, {
			redirectURI
		});
		this.clientSecret = clientSecret;
	}

	public async createAuthorizationURL(
		state: string,
		codeVerifier: string,
		options?: {
			scopes?: string[];
		}
	): Promise<URL> {
		return await this.client.createAuthorizationURL({
			state,
			codeVerifier,
			scopes: options?.scopes ?? []
		});
	}

	public async validateAuthorizationCode(
		code: string,
		codeVerifier: string
	): Promise<TwitterTokens> {
		const result = await this.client.validateAuthorizationCode<TokenResponseBody>(code, {
			credentials: this.clientSecret,
			codeVerifier
		});
		const tokens: TwitterTokens = {
			accessToken: result.access_token,
			refreshToken: result.refresh_token ?? null
		};
		return tokens;
	}

	public async refreshAccessToken(refreshToken: string): Promise<TwitterTokens> {
		const result = await this.client.refreshAccessToken<TokenResponseBody>(refreshToken, {
			credentials: this.clientSecret
		});
		const tokens: TwitterTokens = {
			accessToken: result.access_token,
			refreshToken: result.refresh_token ?? null
		};
		return tokens;
	}
}

interface TokenResponseBody {
	access_token: string;
	refresh_token?: string;
}

export interface TwitterTokens {
	accessToken: string;
	refreshToken: string | null;
}
