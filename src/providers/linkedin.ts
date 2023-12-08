import { OAuth2Client } from "oslo/oauth2";
import { TimeSpan, createDate } from "oslo";

import type { OAuth2Provider } from "../index.js";

const authorizeEndpoint = "https://www.linkedin.com/oauth/v2/authorization";
const tokenEndpoint = "https://www.linkedin.com/oauth/v2/accessToken";
const userinfoEndpoint = "https://api.linkedin.com/v2/userinfo";

export class LinkedIn implements OAuth2Provider {
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

	public async createAuthorizationURL(state: string): Promise<URL> {
		return await this.client.createAuthorizationURL({
			state,
			scope: this.scope
		});
	}

	public async validateAuthorizationCode(code: string): Promise<LinkedInTokens> {
		const result = await this.client.validateAuthorizationCode<TokenResponseBody>(code, {
			authenticateWith: "request_body",
			credentials: this.clientSecret
		});
		return {
			accessToken: result.access_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			refreshToken: result.refresh_token,
			refreshTokenExpiresAt: createDate(new TimeSpan(result.refresh_token_expires_in, "s"))
		};
	}

	public async getUser(accessToken: string): Promise<LinkedInUser> {
		const response = await fetch(userinfoEndpoint, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});
		return await response.json();
	}
}

interface TokenResponseBody {
	access_token: string;
	expires_in: number;
	refresh_token: string;
	refresh_token_expires_in: number;
}

export interface LinkedInTokens {
	accessToken: string;
	accessTokenExpiresAt: Date;
	refreshToken: string;
	refreshTokenExpiresAt: Date;
}

export interface LinkedInUser {
	sub: string;
	name: string;
	email: string;
	email_verified: boolean;
	given_name: string;
	family_name: string;
	locale: {
		country: string;
		language: string;
	};
	picture: string;
}
