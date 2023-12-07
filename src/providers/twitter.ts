import { OAuth2Client, generateState } from "oslo/oauth2";

import type { OAuth2ProviderWithPKCE } from "../index.js";

const authorizeEndpoint = "https://twitter.com/i/oauth2/authorize";
const tokenEndpoint = "https://api.twitter.com/2/oauth2/token";

export class Twitter implements OAuth2ProviderWithPKCE {
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
		this.scope.push("users.read");
		this.clientSecret = clientSecret;
	}

	public async createAuthorizationURL(codeVerifier: string): Promise<URL> {
		return await this.client.createAuthorizationURL({
			state: generateState(),
			scope: this.scope,
			codeVerifier
		});
	}

	public async validateAuthorizationCode(
		code: string,
		codeVerifier: string
	): Promise<TwitterTokens> {
		const result = await this.client.validateAuthorizationCode<TokenResponseBody>(code, {
			credentials: this.clientSecret,
			codeVerifier
		});
		return {
			accessToken: result.access_token,
			refreshToken: result.refresh_token ?? null
		};
	}

	public async getUser(accessToken: string): Promise<TwitterUser> {
		const response = await fetch("https://api.twitter.com/2/users/me", {
			headers: {
				Authorization: ["Bearer", accessToken].join(" ")
			}
		});
		return await response.json();
	}

	public async refreshAccessToken(refreshToken: string): Promise<TwitterTokens> {
		const result = await this.client.refreshAccessToken<TokenResponseBody>(refreshToken, {
			authenticateWith: "request_body",
			credentials: this.clientSecret
		});
		return {
			accessToken: result.access_token,
			refreshToken: result.refresh_token ?? null
		};
	}
}

interface TokenResponseBody {
	access_token: string;
	refresh_token?: string;
}

export interface TwitterTokens {
	accessToken: string;
	refreshToken: string | null;
}

export interface TwitterUser {
	id: string;
	name: string;
	username: string;
}
