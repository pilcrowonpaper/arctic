import { TimeSpan, createDate } from "oslo";
import { parseJWT } from "oslo/jwt";
import { OAuth2Controller } from "oslo/oauth2";

export class AzureAD {
	private controller: OAuth2Controller;
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
		this.controller = new OAuth2Controller(clientId, authorizeEndpoint, tokenEndpoint, {
			redirectURI
		});
		this.scope = options?.scope ?? [];
		this.scope.push("openid", "profile");
		this.clientSecret = clientSecret;
	}

	public async createAuthorizationURL(state: string, codeVerifier: string): Promise<URL> {
		const url = await this.controller.createAuthorizationURL({
			state,
			scope: this.scope,
			codeVerifier
		});
		url.searchParams.set("nonce", "_");
		return url;
	}

	public async validateAuthorizationCode(
		code: string,
		codeVerifier: string
	): Promise<AzureADTokens> {
		const result = await this.controller.validateAuthorizationCode<TokenResponseBody>(code, {
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

	public async getUser(accessToken: string): Promise<AzureADUser> {
		const response = await fetch("https://graph.microsoft.com/oidc/userinfo", {
			headers: {
				Authorization: ["Bearer", accessToken].join(" ")
			}
		});
		return await response.json();
	}

	public async refreshAccessToken(refreshToken: string): Promise<AzureADTokens> {
		const result = await this.controller.refreshAccessToken<TokenResponseBody>(refreshToken, {
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

	private parseIdToken(idToken: string): AzureADIdTokenClaims {
		const parsedIdToken = parseJWT(idToken);
		if (!parsedIdToken) throw new Error();
		return parsedIdToken.payload as unknown as AzureADIdTokenClaims;
	}
}

export interface AzureADIdTokenClaims {
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

export interface AzureADTokens {
	idToken: string;
	accessToken: string;
	accessTokenExpiresAt: Date;
	refreshToken: string | null;
	idTokenClaims: AzureADIdTokenClaims;
}

export interface AzureADUser {
	sub: string;
	name: string;
	family_name: string;
	given_name: string;
	picture: string;
	email?: string;
}
