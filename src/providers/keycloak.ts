import { OAuth2Client } from "oslo/oauth2";
import { TimeSpan, createDate } from "oslo";

import type { OAuth2ProviderWithPKCE } from "../index.js";

const authorizePath = "/protocol/openid-connect/auth";
const tokenPath = "/protocol/openid-connect/token";
const userinfoPath = "/protocol/openid-connect/userinfo";

export class Keycloak implements OAuth2ProviderWithPKCE {
	private client: OAuth2Client;
	private realmURL: string;
	private clientSecret: string;
	private scope: string[];

	constructor(
		realmURL: string,
		clientId: string,
		clientSecret: string,
		redirectURI: string,
		options?: {
			scope?: string[];
		}
	) {
		this.realmURL = realmURL;
		const authorizeEndpoint = this.realmURL + authorizePath;
		const tokenEndpoint = this.realmURL + tokenPath;
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
	): Promise<KeycloakTokens> {
		const result = await this.client.validateAuthorizationCode<TokenResponseBody>(code, {
			codeVerifier,
			authenticateWith: "request_body",
			credentials: this.clientSecret
		});

		return {
			accessToken: result.access_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			refreshToken: result.refresh_token,
			refreshTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			idToken: result.id_token
		};
	}

	public async getUser(accessToken: string): Promise<KeycloakUser> {
		const response = await fetch(this.realmURL + userinfoPath, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});
		return await response.json();
	}

	public async refreshAccessToken(refreshToken: string): Promise<KeycloakTokens> {
		const result = await this.client.refreshAccessToken<TokenResponseBody>(refreshToken, {
			authenticateWith: "request_body",
			credentials: this.clientSecret
		});

		return {
			accessToken: result.access_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			refreshToken: result.refresh_token,
			refreshTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			idToken: result.id_token
		};
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

export interface KeycloakUser {
	exp: number;
	iat: number;
	auth_time: number;
	jti: string;
	iss: string;
	aud: string;
	sub: string; // user_id
	typ: string;
	azp: string;
	session_state: string;
	at_hash: string;
	acr: string;
	sid: string;
	email_verified: boolean;
	name: string;
	preferred_username: string;
	given_name: string;
	locale: string;
	family_name: string;
	email: string;
	picture: string;
	user: any;
}
