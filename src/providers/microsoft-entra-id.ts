import { TimeSpan, createDate } from "oslo";
import { parseJWT } from "oslo/jwt";
import { OAuth2Client } from "oslo/oauth2";

import type { OAuth2ProviderWithPKCE } from "../index.js";

export class MicrosoftEntraID implements OAuth2ProviderWithPKCE {
	private client: OAuth2Client;
	private scope: string[];
	private clientSecret: string;

	constructor(
		tenant: string,
		clientId: string,
		clientSecret: string,
		redirectURI: string,
		options?: {
			scope?: string[];
		}
	) {
		const authorizeEndpoint = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize`;
		const tokenEndpoint = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`;
		this.client = new OAuth2Client(clientId, authorizeEndpoint, tokenEndpoint, {
			redirectURI
		});
		this.scope = options?.scope ?? [];
		this.scope.push("openid", "profile");
		this.clientSecret = clientSecret;
	}

	public async createAuthorizationURL(codeVerifier: string): Promise<URL> {
		const url = await this.client.createAuthorizationURL({
			scope: this.scope,
			codeVerifier
		});
		url.searchParams.set("nonce", "_");
		return url;
	}

	public async validateAuthorizationCode(
		code: string,
		codeVerifier: string
	): Promise<MicrosoftEntraIDTokens> {
		const result = await this.client.validateAuthorizationCode<TokenResponseBody>(code, {
			authenticateWith: "request_body",
			credentials: this.clientSecret,
			codeVerifier
		});
		return {
			accessToken: result.access_token,
			refreshToken: result.refresh_token ?? null,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			idToken: result.id_token,
			idTokenClaims: this.parseIdToken(result.id_token)
		};
	}

	public async getUser(accessToken: string): Promise<MicrosoftEntraIDUser> {
		const response = await fetch("https://graph.microsoft.com/oidc/userinfo", {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});
		return await response.json();
	}

	public async refreshAccessToken(refreshToken: string): Promise<MicrosoftEntraIDTokens> {
		const result = await this.client.refreshAccessToken<TokenResponseBody>(refreshToken, {
			authenticateWith: "request_body",
			credentials: this.clientSecret
		});
		return {
			accessToken: result.access_token,
			refreshToken: result.refresh_token ?? null,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			idToken: result.id_token,
			idTokenClaims: this.parseIdToken(result.id_token)
		};
	}

	private parseIdToken(idToken: string): MicrosoftEntraIDIdTokenClaims {
		const parsedIdToken = parseJWT(idToken);
		if (!parsedIdToken) throw new Error("Failed to parse ID token");
		return parsedIdToken.payload as unknown as MicrosoftEntraIDIdTokenClaims;
	}
}

export interface MicrosoftEntraIDIdTokenClaims {
	sub: string;
	iss: string;
	aud: string;
	idp: string;
	iat: number;
	nbf: number;
	exp: number;
	at_hash: string;
	preferred_username: string;
	email?: string;
	name: string;
	oid: string;
	roles: string[];
	tid: string;
	uti: string;
	ver: "1.0" | "2.0";
	hasgroups?: true;
}

interface TokenResponseBody {
	access_token: string;
	expires_in: number;
	refresh_token?: string;
	id_token: string;
}

export interface MicrosoftEntraIDTokens {
	idToken: string;
	accessToken: string;
	accessTokenExpiresAt: Date;
	refreshToken: string | null;
	idTokenClaims: MicrosoftEntraIDIdTokenClaims;
}

export interface MicrosoftEntraIDUser {
	sub: string;
	name: string;
	family_name: string;
	given_name: string;
	picture: string;
	email?: string;
}
