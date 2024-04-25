import { TimeSpan, createDate } from "oslo";
import { OAuth2Client } from "oslo/oauth2";

import type { OAuth2Provider } from "../index.js";

const authorizeEndpoint = "https://apis.roblox.com/oauth/v1/authorize";
const tokenEndpoint = "https://apis.roblox.com/oauth/v1/token";

export class Roblox implements OAuth2Provider {
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

	public async validateAuthorizationCode(code: string): Promise<RobloxTokens> {
		const result = await this.client.validateAuthorizationCode<TokenResponseBody>(code, {
			credentials: this.clientSecret
		});
		const tokens: RobloxTokens = {
			accessToken: result.access_token,
			refreshToken: result.refresh_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			idToken: result.id_token
		};
		return tokens;
	}

	public async refreshAccessToken(refreshToken: string): Promise<RobloxTokens> {
		const result = await this.client.refreshAccessToken<TokenResponseBody>(refreshToken, {
			credentials: this.clientSecret
		});
		const tokens: RobloxTokens = {
			accessToken: result.access_token,
			refreshToken: result.refresh_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			idToken: result.id_token
		};
		return tokens;
	}
}

interface TokenResponseBody {
	access_token: string;
	refresh_token: string;
	expires_in: number;
	id_token: string;
}

export interface RobloxTokens {
	accessToken: string;
	refreshToken: string;
	accessTokenExpiresAt: Date;
	idToken: string;
}
