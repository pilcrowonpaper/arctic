import { OAuth2Client } from "oslo/oauth2";
import { TimeSpan, createDate } from "oslo";

import type { OAuth2ProviderWithPKCE } from "../index.js";

export class Keycloak implements OAuth2ProviderWithPKCE {
	private client: OAuth2Client;
	private realmURL: string;
	private clientSecret: string;

	constructor(realmURL: string, clientId: string, clientSecret: string, redirectURI: string) {
		this.realmURL = realmURL;
		const authorizeEndpoint = this.realmURL + "/protocol/openid-connect/auth";
		const tokenEndpoint = this.realmURL + "/protocol/openid-connect/token";
		this.client = new OAuth2Client(clientId, authorizeEndpoint, tokenEndpoint, {
			redirectURI
		});
		this.clientSecret = clientSecret;
	}

	public async createAuthorizationURL(
		codeVerifier: string,
		state?: string,
		options?: {
			scopes?: string[];
		}
	): Promise<URL> {
		const scopes = options?.scopes ?? [];
		const url = await this.client.createAuthorizationURL({
			codeVerifier,
			scopes: [...scopes, "openid"]
		});
		if (state) url.searchParams.set("state", state);
		return url;
	}
	public async validateAuthorizationCode(
		code: string,
		codeVerifier: string
	): Promise<KeycloakTokens> {
		const result = await this.client.validateAuthorizationCode<TokenResponseBody>(code, {
			codeVerifier,
			authenticateWith: "request_body",
			credentials: this.clientSecret
		});
		const tokens: KeycloakTokens = {
			accessToken: result.access_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			refreshToken: result.refresh_token,
			refreshTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			idToken: result.id_token
		};
		return tokens;
	}

	public async refreshAccessToken(refreshToken: string): Promise<KeycloakTokens> {
		const result = await this.client.refreshAccessToken<TokenResponseBody>(refreshToken, {
			authenticateWith: "request_body",
			credentials: this.clientSecret
		});
		const tokens: KeycloakTokens = {
			accessToken: result.access_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			refreshToken: result.refresh_token,
			refreshTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			idToken: result.id_token
		};
		return tokens;
	}
}

interface TokenResponseBody {
	access_token: string;
	refresh_token: string;
	id_token: string;
	expires_in: number;
	refresh_expires_in: number;
}

export interface KeycloakTokens {
	accessToken: string;
	accessTokenExpiresAt: Date;
	refreshToken: string | null;
	refreshTokenExpiresAt: Date | null;
	idToken: string;
}
