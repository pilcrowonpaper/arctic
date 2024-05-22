import { OAuth2Client } from "oslo/oauth2";
import { TimeSpan, createDate } from "oslo";

import type { OAuth2Provider } from "../index.js";

const authorizeEndpoint = "https://www.linkedin.com/oauth/v2/authorization";
const tokenEndpoint = "https://www.linkedin.com/oauth/v2/accessToken";

export class LinkedIn implements OAuth2Provider {
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

	public async validateAuthorizationCode(code: string): Promise<LinkedInTokens> {
		const result = await this.client.validateAuthorizationCode<AuthorizationCodeResponseBody>(
			code,
			{
				authenticateWith: "request_body",
				credentials: this.clientSecret
			}
		);
		const tokens: LinkedInTokens = {
			idToken: result.id_token,
			accessToken: result.access_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			refreshToken: result.refresh_token ?? null,
			refreshTokenExpiresAt: result.refresh_token_expires_in
				? createDate(new TimeSpan(result.refresh_token_expires_in, "s"))
				: null
		};
		return tokens;
	}

	public async refreshAccessToken(accessToken: string): Promise<LinkedInRefreshedTokens> {
		const result = await this.client.refreshAccessToken<RefreshTokenResponseBody>(accessToken, {
			authenticateWith: "request_body",
			credentials: this.clientSecret
		});
		const tokens: LinkedInRefreshedTokens = {
			accessToken: result.access_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			refreshToken: result.refresh_token,
			refreshTokenExpiresAt: createDate(new TimeSpan(result.refresh_token_expires_in, "s"))
		};
		return tokens;
	}
}

interface AuthorizationCodeResponseBody {
	id_token: string;
	access_token: string;
	expires_in: number;
	refresh_token?: string; // available only if your application is authorized for programmatic refresh tokens
	refresh_token_expires_in?: number;
}

interface RefreshTokenResponseBody {
	access_token: string;
	expires_in: number;
	refresh_token: string;
	refresh_token_expires_in: number;
}

export interface LinkedInTokens {
	idToken: string;
	accessToken: string;
	accessTokenExpiresAt: Date;
	refreshToken: string | null;
	refreshTokenExpiresAt: Date | null;
}

export interface LinkedInRefreshedTokens {
	accessToken: string;
	accessTokenExpiresAt: Date;
	refreshToken: string;
	refreshTokenExpiresAt: Date;
}
