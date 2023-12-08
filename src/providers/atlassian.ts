import { OAuth2Client } from "oslo/oauth2";
import { TimeSpan, createDate } from "oslo";

import type { OAuth2Provider } from "../index.js";

const authorizeEndpoint = "https://auth.atlassian.com/authorize";
const tokenEndpoint = "https://auth.atlassian.com/token";
const userEndpoint = "https://api.atlassian.com/me";

export class Atlassian implements OAuth2Provider {
	private client: OAuth2Client;
	private scope: string[];
	private clientSecret: string;

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
		this.scope = options?.scope ?? [];
		this.scope.push("read:me");
		this.clientSecret = clientSecret;
	}

	public async createAuthorizationURL(codeVerifier: string): Promise<URL> {
		const url = await this.client.createAuthorizationURL({
			codeVerifier,
			scope: this.scope
		});
		url.searchParams.set("audience", "api.atlassian.com");
		url.searchParams.set("prompt", "consent");
		return url;
	}

	public async validateAuthorizationCode(code: string): Promise<AtlassianTokens> {
		const result = await this.client.validateAuthorizationCode<TokenResponseBody>(code, {
			authenticateWith: "request_body",
			credentials: this.clientSecret
		});
		return {
			accessToken: result.access_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			refreshToken: result.refresh_token ?? null
		};
	}

	public async getUser(accessToken: string): Promise<AtlassianUser> {
		const response = await fetch(userEndpoint, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});
		return await response.json();
	}

	public async refreshAccessToken(refreshToken: string): Promise<AtlassianTokens> {
		const result = await this.client.validateAuthorizationCode<TokenResponseBody>(refreshToken, {
			authenticateWith: "request_body",
			credentials: this.clientSecret
		});
		return {
			accessToken: result.access_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			refreshToken: result.refresh_token ?? null
		};
	}
}

interface TokenResponseBody {
	access_token: string;
	expires_in: number;
	refresh_token?: string;
}

export interface AtlassianTokens {
	accessToken: string;
	accessTokenExpiresAt: Date;
	refreshToken: string | null;
}

export interface AtlassianUser {
	account_type: string;
	account_id: string;
	email: string;
	name: string;
	picture: string;
	account_status: string;
	nickname: string;
	zoneinfo: string;
	locale: string;
	extended_profile?: Record<string, string>;
}
