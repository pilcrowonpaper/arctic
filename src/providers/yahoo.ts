import { OAuth2Client } from "oslo/oauth2";
import { TimeSpan, createDate } from "oslo";

import type { OAuth2Provider } from "../index.js";

const authorizeEndpoint = "https://api.login.yahoo.com/oauth2/request_auth";
const tokenEndpoint = "https://api.login.yahoo.com/oauth2/get_token";

export class Yahoo implements OAuth2Provider {
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
		const scopes = options?.scopes ?? [];
		return await this.client.createAuthorizationURL({
			state,
			scopes: [...scopes, "openid"]
		});
	}

	public async validateAuthorizationCode(code: string): Promise<YahooTokens> {
		const result = await this.client.validateAuthorizationCode<TokenResponseBody>(code, {
			credentials: this.clientSecret
		});
		const tokens: YahooTokens = {
			accessToken: result.access_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			refreshToken: result.refresh_token,
			idToken: result.id_token
		};
		return tokens;
	}

	public async refreshAccessToken(refreshToken: string): Promise<YahooTokens> {
		const result = await this.client.refreshAccessToken<TokenResponseBody>(refreshToken, {
			credentials: this.clientSecret
		});
		const tokens: YahooTokens = {
			accessToken: result.access_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			refreshToken: result.refresh_token,
			idToken: result.id_token
		};
		return tokens;
	}
}

interface TokenResponseBody {
	access_token: string;
	refresh_token: string;
	id_token: string;
	expires_in: number;
}

export interface YahooTokens {
	accessToken: string;
	accessTokenExpiresAt: Date;
	refreshToken: string | null;
	idToken: string;
}
