import { TimeSpan, createDate } from "oslo";
import { OAuth2Client } from "oslo/oauth2";

import type { OAuth2Provider } from "../index.js";

const authorizeEndpoint = "https://www.figma.com/oauth";
const tokenEndpoint = "https://www.figma.com/api/oauth/token";

export class Figma implements OAuth2Provider {
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

	public async validateAuthorizationCode(code: string): Promise<FigmaTokens> {
		const result = await this.client.validateAuthorizationCode<AuthorizationCodeResponseBody>(
			code,
			{
				authenticateWith: "request_body",
				credentials: this.clientSecret
			}
		);
		const tokens: FigmaTokens = {
			accessToken: result.access_token,
			refreshToken: result.refresh_token ?? null,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			userId: result.user_id
		};
		return tokens;
	}

	public async refreshAccessToken(refreshToken: string): Promise<FigmaRefreshedTokens> {
		const result = await this.client.refreshAccessToken<RefreshTokenResponseBody>(refreshToken, {
			authenticateWith: "request_body",
			credentials: this.clientSecret
		});
		const tokens: FigmaRefreshedTokens = {
			accessToken: result.access_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s"))
		};
		return tokens;
	}
}

interface AuthorizationCodeResponseBody {
	access_token: string;
	refresh_token?: string;
	expires_in: number;
	user_id: string;
}

interface RefreshTokenResponseBody {
	access_token: string;
	expires_in: number;
}

export interface FigmaTokens {
	userId: string;
	accessToken: string;
	refreshToken: string | null;
	accessTokenExpiresAt: Date;
}

export interface FigmaRefreshedTokens {
	accessToken: string;
	accessTokenExpiresAt: Date;
}
