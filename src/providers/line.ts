import { OAuth2Client, generateState } from "oslo/oauth2";
import { TimeSpan, createDate } from "oslo";

import type { OAuth2ProviderWithPKCE } from "../index.js";

const authorizeEndpoint = "https://access.line.me/oauth2/v2.1/authorize";
const tokenEndpoint = "https://api.line.me/oauth2/v2.1/token";

export class Line implements OAuth2ProviderWithPKCE {
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
		const scopes = options?.scopes ?? [];
		const url = await this.client.createAuthorizationURL({
			codeVerifier,
			scopes: [...scopes, "openid"]
		});
		url.searchParams.set("state", generateState());
		return url;
	}

	public async validateAuthorizationCode(code: string, codeVerifier: string): Promise<LineTokens> {
		const result = await this.client.validateAuthorizationCode<AuthorizationCodeResponseBody>(
			code,
			{
				authenticateWith: "request_body",
				credentials: this.clientSecret,
				codeVerifier
			}
		);
		const tokens: LineTokens = {
			accessToken: result.access_token,
			refreshToken: result.refresh_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			idToken: result.id_token
		};
		return tokens;
	}

	public async refreshAccessToken(refreshToken: string): Promise<LineRefreshedTokens> {
		const result = await this.client.refreshAccessToken<RefreshTokenResponseBody>(refreshToken, {
			authenticateWith: "request_body",
			credentials: this.clientSecret
		});
		const tokens: LineRefreshedTokens = {
			accessToken: result.access_token,
			refreshToken: result.refresh_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s"))
		};
		return tokens;
	}
}

interface AuthorizationCodeResponseBody {
	access_token: string;
	expires_in: number;
	refresh_token: string;
	id_token: string;
}
interface RefreshTokenResponseBody {
	access_token: string;
	expires_in: number;
	refresh_token: string;
}

export interface LineRefreshedTokens {
	accessToken: string;
	refreshToken: string;
	accessTokenExpiresAt: Date;
}

export interface LineTokens {
	accessToken: string;
	refreshToken: string;
	accessTokenExpiresAt: Date;
	idToken: string;
}
