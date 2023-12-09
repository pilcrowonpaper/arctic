import { OAuth2Client } from "oslo/oauth2";

import type { OAuth2Provider } from "../index.js";
import { TimeSpan, createDate } from "oslo";

const authorizeEndpoint = "https://nid.naver.com/oauth2.0/authorize";
const tokenEndpoint = "https://nid.naver.com/oauth2.0/token";
const userinfoEndpoint = "https://openapi.naver.com/v1/nid/me";

export class Naver implements OAuth2Provider {
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
	}

	public async createAuthorizationURL(state: string): Promise<URL> {
		return await this.client.createAuthorizationURL({
			state,
			scope: this.scope
		});
	}

	public async validateAuthorizationCode(code: string): Promise<NaverTokens> {
		const result = await this.client.validateAuthorizationCode<TokenResponseBody>(code, {
			credentials: this.clientSecret
		});

		return {
			accessToken: result.access_token,
			refreshToken: result.refresh_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s"))
		};
	}

	public async getUser(accessToken: string): Promise<NaverUserResponse> {
		const response = await fetch(userinfoEndpoint, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});
		return await response.json();
	}

	public async refreshAccessToken(refreshToken: string): Promise<NaverTokens> {
		const result = await this.client.refreshAccessToken<TokenResponseBody>(refreshToken, {
			authenticateWith: "request_body",
			credentials: this.clientSecret
		});

		return {
			accessToken: result.access_token,
			refreshToken: result.refresh_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s"))
		};
	}
}

interface TokenResponseBody {
	access_token: string;
	refresh_token: string;
	expires_in: number;
}

export interface NaverTokens {
	accessToken: string;
	refreshToken: string;
	accessTokenExpiresAt: Date;
}

export interface NaverUser {
	id: string;
	nickname: string;
	name: string;
	email: string;
	gender: "F" | "M" | "U";
	age: string;
	birthday: string;
	profile_image: string;
	birthyear: string;
	mobile: string;
}

export interface NaverUserResponse {
	resultcode: string;
	message: string;
	response: NaverUser;
}
