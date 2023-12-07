import { OAuth2Client, generateState } from "oslo/oauth2";

import type { OAuth2ProviderWithPKCE } from "../index.js";

const authorizeEndpoint = "https://www.linkedin.com/oauth/v2/authorization";
const tokenEndpoint = "https://www.linkedin.com/oauth/v2/accessToken";

export class LinkedIn implements OAuth2ProviderWithPKCE {
	private client: OAuth2Client;
	private scope: string[];

	constructor(
		clientId: string,
		redirectURI: string,
		options?: {
			scope?: string[];
		}
	) {
		this.client = new OAuth2Client(clientId, authorizeEndpoint, tokenEndpoint, {
			redirectURI
		});
		this.scope = options?.scope ?? [];
		this.scope.push("openid", "profile");
	}

	public async createAuthorizationURL(codeVerifier: string): Promise<URL> {
		return await this.client.createAuthorizationURL({
			codeVerifier,
			state: generateState(),
			scope: this.scope
		});
	}

	public async validateAuthorizationCode(
		code: string,
		codeVerifier: string
	): Promise<LinkedInTokens> {
		const result = await this.client.validateAuthorizationCode<TokenResponseBody>(code, {
			codeVerifier
		});
		return {
			accessToken: result.access_token,
			accessTokenExpiresIn: result.expires_in,
			refreshToken: result.refresh_token,
			refreshTokenExpiresIn: result.refresh_token_expires_in
		};
	}

	public async getUser(accessToken: string): Promise<LinkedInUser> {
		const response = await fetch("https://api.linkedin.com/v2/userinfo", {
			headers: {
				Authorization: ["Bearer", accessToken].join(" ")
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

export type LinkedInTokens = {
	accessToken: string;
	accessTokenExpiresIn: number;
	refreshToken: string;
	refreshTokenExpiresIn: number;
};

export type LinkedInUser = {
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
};
