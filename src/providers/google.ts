import { TimeSpan, createDate } from "oslo";
import { OAuth2Client } from "oslo/oauth2";

import type { OAuth2ProviderWithPKCE } from "../index.js";

const authorizeEndpoint = "https://accounts.google.com/o/oauth2/v2/auth";
const tokenEndpoint = "https://oauth2.googleapis.com/token";

export class Google implements OAuth2ProviderWithPKCE {
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
		const scopes = options?.scopes ?? [];
		const url = await this.client.createAuthorizationURL({
			codeVerifier,
			scopes: [...scopes, "openid"]
		});
		url.searchParams.set("state", state);
		url.searchParams.set("nonce", "_");
		return url;
	}

	public async validateAuthorizationCode(
		code: string,
		codeVerifier: string
	): Promise<GoogleTokens> {
		const result = await this.client.validateAuthorizationCode<AuthorizationCodeResponseBody>(
			code,
			{
				authenticateWith: "request_body",
				credentials: this.clientSecret,
				codeVerifier
			}
		);
		const tokens: GoogleTokens = {
			accessToken: result.access_token,
			refreshToken: result.refresh_token ?? null,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			idToken: result.id_token
		};
		return tokens;
	}

	public async refreshAccessToken(refreshToken: string): Promise<GoogleRefreshedTokens> {
		const result = await this.client.refreshAccessToken<RefreshTokenResponseBody>(refreshToken, {
			authenticateWith: "request_body",
			credentials: this.clientSecret
		});
		const tokens: GoogleRefreshedTokens = {
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
	id_token: string;
}

interface RefreshTokenResponseBody {
	access_token: string;
	expires_in: number;
}

export interface GoogleTokens {
	accessToken: string;
	refreshToken: string | null;
	accessTokenExpiresAt: Date;
	idToken: string;
}

export interface GoogleRefreshedTokens {
	accessToken: string;
	accessTokenExpiresAt: Date;
}
