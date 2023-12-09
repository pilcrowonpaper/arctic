import { OAuth2Client, generateState } from "oslo/oauth2";

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
		codeVerifier: string,
		options?: {
			scopes?: string[];
		}
	): Promise<URL> {
		const url = await this.client.createAuthorizationURL({
			codeVerifier,
			scopes: options?.scopes
		});
		url.searchParams.set("state", generateState());
		return url;
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
			authenticateWith: "request_body",
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
