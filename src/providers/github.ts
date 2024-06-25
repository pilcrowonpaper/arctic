import { OAuth2Client } from "oslo/oauth2";

import type { OAuth2Provider } from "../index.js";
import { TimeSpan, createDate } from "oslo";

export class GitHub implements OAuth2Provider {
	private client: OAuth2Client;
	private clientSecret: string;

	constructor(
		clientId: string,
		clientSecret: string,
		options?: {
			redirectURI?: string;
			enterpriseDomain?: string;
		}
	) {
		const baseUrl = options?.enterpriseDomain ?? "https://github.com";

		const authorizeEndpoint = baseUrl + "/login/oauth/authorize";
		const tokenEndpoint = baseUrl + "/login/oauth/access_token";

		this.client = new OAuth2Client(clientId, authorizeEndpoint, tokenEndpoint, {
			redirectURI: options?.redirectURI
		});
		this.clientSecret = clientSecret;
	}

	public async createAuthorizationURL(
		state: string,
		options?: {
			scopes?: string[];
		}
	): Promise<URL> {
		return await this.client.createAuthorizationURL({
			state,
			scopes: options?.scopes ?? []
		});
	}

	public async validateAuthorizationCode(code: string): Promise<GitHubTokens> {
		const result = await this.client.validateAuthorizationCode<TokenResponseBody>(code, {
			authenticateWith: "request_body",
			credentials: this.clientSecret
		});
		const tokens: GitHubTokens = {
			accessToken: result.access_token,
			refreshToken: result.refresh_token ?? null,
			accessTokenExpiresAt: result.expires_in ? createDate(new TimeSpan(result.expires_in, "s")) : undefined,
			refreshTokenExpiresAt: result.refresh_token_expires_in ? createDate(new TimeSpan(result.refresh_token_expires_in, "s")) : undefined
		};
		return tokens;
	}

	public async refreshAccessToken(refreshToken: string): Promise<GitHubTokens> {
		const result = await this.client.refreshAccessToken<TokenResponseBody>(refreshToken, {
			authenticateWith: "request_body",
			credentials: this.clientSecret
		});
		const tokens: GitHubTokens = {
			accessToken: result.access_token,
			refreshToken: result.refresh_token ?? null,
			accessTokenExpiresAt: result.expires_in ? createDate(new TimeSpan(result.expires_in, "s")) : undefined,
			refreshTokenExpiresAt: result.refresh_token_expires_in ? createDate(new TimeSpan(result.refresh_token_expires_in, "s")) : undefined
		};
		return tokens;
	}
}

interface TokenResponseBody {
  access_token: string,
	expires_in?: number;
	refresh_token?: string;
	refresh_token_expires_in?: number,
}

export interface GitHubTokens {
	accessToken: string;
	refreshToken?: string | null;
	accessTokenExpiresAt?: Date;
	refreshTokenExpiresAt?: Date | null;
}

