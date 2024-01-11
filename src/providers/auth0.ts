import { OAuth2Client } from "oslo/oauth2";

import type { OAuth2Provider } from "../index.js";

export class Auth0 implements OAuth2Provider {
	private client: OAuth2Client;
	private appDomain: string;
	private clientSecret: string;

	constructor(appDomain: string, clientId: string, clientSecret: string, redirectURI: string) {
		this.appDomain = appDomain;
		const authorizeEndpoint = this.appDomain + "/authorize";
		const tokenEndpoint = this.appDomain + "/oauth/token";
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

	public async validateAuthorizationCode(code: string): Promise<Auth0Tokens> {
		const result = await this.client.validateAuthorizationCode<TokenResponseBody>(code, {
			authenticateWith: "request_body",
			credentials: this.clientSecret
		});
		const tokens: Auth0Tokens = {
			accessToken: result.access_token,
			refreshToken: result.refresh_token,
			idToken: result.id_token
		};
		return tokens;
	}

	public async refreshAccessToken(refreshToken: string): Promise<Auth0Tokens> {
		const result = await this.client.refreshAccessToken<TokenResponseBody>(refreshToken, {
			authenticateWith: "request_body",
			credentials: this.clientSecret
		});
		const tokens: Auth0Tokens = {
			accessToken: result.access_token,
			refreshToken: result.refresh_token,
			idToken: result.id_token
		};
		return tokens;
	}
}

interface TokenResponseBody {
	access_token: string;
	refresh_token: string;
	id_token: string;
}

export interface Auth0Tokens {
	accessToken: string;
	refreshToken: string;
	idToken: string;
}
