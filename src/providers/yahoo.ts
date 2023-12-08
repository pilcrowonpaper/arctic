import { OAuth2Client } from "oslo/oauth2";
import { TimeSpan, createDate } from "oslo";

import type { OAuth2ProviderWithPKCE } from "../index.js";

const authorizeEndpoint = "https://api.login.yahoo.com/oauth2/request_auth";
const tokenEndpoint = "https://api.login.yahoo.com/oauth2/get_token";
const userinfoEndpoint = "https://api.login.yahoo.com/openid/v1/userinfo";

export class Yahoo implements OAuth2ProviderWithPKCE {
	private client: OAuth2Client;
	private clientSecret: string;
	private scope: string[];

	constructor(
		clientId: string,
		clientSecret: string,
		redirectURI: string,
		options?: {
			scope?: string[];
		}
	) {
		this.client = new OAuth2Client(clientId, authorizeEndpoint, tokenEndpoint, {
			redirectURI
		});
		this.clientSecret = clientSecret;
		this.scope = options?.scope ?? [];
		this.scope.push("openid", "profile");
	}

	public async createAuthorizationURL(codeVerifier: string): Promise<URL> {
		return await this.client.createAuthorizationURL({
			scope: this.scope,
			codeVerifier
		});
	}
	public async validateAuthorizationCode(
		code: string,
		codeVerifier: string
	): Promise<YahooTokens> {
		const result = await this.client.validateAuthorizationCode<TokenResponseBody>(code, {
			codeVerifier,
			authenticateWith: "request_body",
			credentials: this.clientSecret
		});

		return {
			accessToken: result.access_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			refreshToken: result.refresh_token,
			idToken: result.id_token
		};
	}

	public async getUser(accessToken: string): Promise<YahooUser> {
		const response = await fetch(userinfoEndpoint, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});
		return await response.json();
	}

	public async refreshAccessToken(refreshToken: string): Promise<YahooTokens> {
		const result = await this.client.refreshAccessToken<TokenResponseBody>(refreshToken, {
			authenticateWith: "request_body",
			credentials: this.clientSecret
		});

		return {
			accessToken: result.access_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			refreshToken: result.refresh_token,
			idToken: result.id_token
		};
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

export interface YahooUser {
	email?: string;
	email_verified?: boolean;
	family_name: string;
	given_name: string;
	locale: string;
	name: string;
	sub: string;
}
