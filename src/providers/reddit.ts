import { OAuth2Client } from "oslo/oauth2";
import { TimeSpan, createDate } from "oslo";

import type { OAuth2Provider } from "../index.js";

const authorizeEndpoint = "https://www.reddit.com/api/v1/authorize";
const tokenEndpoint = "https://www.reddit.com/api/v1/access_token";

export class Reddit implements OAuth2Provider {
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
		options?: {
			scopes?: string[];
		}
	): Promise<URL> {
		const url = await this.client.createAuthorizationURL({
			scopes: options?.scopes ?? []
		});
		url.searchParams.set("state", state);
		return url;
	}

	public async validateAuthorizationCode(code: string): Promise<RedditTokens> {
		const result = await this.client.validateAuthorizationCode<TokenResponseBody>(code, {
			credentials: this.clientSecret
		});
		const tokens: RedditTokens = {
			accessToken: result.access_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			refreshToken: result.refresh_token ?? null
		};
		return tokens;
	}

	public async refreshAccessToken(refreshToken: string): Promise<RedditTokens> {
		const result = await this.client.refreshAccessToken<TokenResponseBody>(refreshToken, {
			credentials: this.clientSecret
		});
		const tokens: RedditTokens = {
			accessToken: result.access_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			refreshToken: result.refresh_token ?? null
		};
		return tokens;
	}
}

interface TokenResponseBody {
	access_token: string;
	refresh_token?: string;
	expires_in: number;
}

export interface RedditTokens {
	accessToken: string;
	refreshToken: string | null;
	accessTokenExpiresAt: Date;
}
