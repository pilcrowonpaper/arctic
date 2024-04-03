import { TimeSpan, createDate } from "oslo";
import { OAuth2Client } from "oslo/oauth2";

import type { OAuth2Provider } from "../index.js";

const authorizeEndpoint = "https://slack.com/openid/connect/authorize";
const tokenEndpoint = "https://slack.com/api/openid.connect.token";

export class Slack implements OAuth2Provider {
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

	public async validateAuthorizationCode(code: string): Promise<SlackTokens> {
		const result = await this.client.validateAuthorizationCode<TokenResponseBody>(code, {
			authenticateWith: "request_body",
			credentials: this.clientSecret
		});
		const tokens: SlackTokens = {
			accessToken: result.access_token,
			idToken: result.id_token,
			refreshToken: result.refresh_token ?? null,
			accessTokenExpiresAt: typeof result.expires_in !== "undefined" && createDate(new TimeSpan(result.expires_in, "s")) || null
		};
		return tokens;
	}

	public async refreshAccessToken(refreshToken: string): Promise<SlackRefreshedTokens> {
		const result = await this.client.refreshAccessToken<RefreshTokenResponseBody>(refreshToken, {
			authenticateWith: "request_body",
			credentials: this.clientSecret
		});
		const tokens: SlackRefreshedTokens = {
			accessToken: result.access_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s"))
		};
		return tokens;
	}
}

interface TokenResponseBody {
	access_token: string;
	id_token: string;
	refresh_token?: string;
	expires_in?: number;
}

interface RefreshTokenResponseBody {
	access_token: string;
	expires_in: number;
}

export interface SlackTokens {
	accessToken: string;
	idToken: string;
	refreshToken: string | null;
	accessTokenExpiresAt: Date | null;
}


export interface SlackRefreshedTokens {
	accessToken: string;
	accessTokenExpiresAt: Date;
}