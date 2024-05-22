import { OAuth2Client } from "oslo/oauth2";
import { TimeSpan, createDate } from "oslo";
import type { OAuth2ProviderWithPKCE } from "../index.js";

export class Authentik implements OAuth2ProviderWithPKCE {
	private client: OAuth2Client;
	private clientSecret: string;

	constructor(realmURL: string, clientId: string, clientSecret: string, redirectURI: string) {
		const authorizeEndpoint = realmURL + "/application/o/authorize/";
		const tokenEndpoint = realmURL + "/application/o/token/";
		this.client = new OAuth2Client(clientId, authorizeEndpoint, tokenEndpoint, {
			redirectURI
		});
		this.clientSecret = clientSecret;
	}

	public async createAuthorizationURL(
		state: string,
		codeVerifier: string,
		options?: {
			scopes?: string[];
		}
	): Promise<URL> {
		const scopes = options?.scopes ?? [];
		return await this.client.createAuthorizationURL({
			state,
			codeVerifier,
			scopes: [...scopes, "openid"]
		});
	}

	public async validateAuthorizationCode(
		code: string,
		codeVerifier: string
	): Promise<AuthentikTokens> {
		const result = await this.client.validateAuthorizationCode<TokenResponseBody>(code, {
			codeVerifier,
			credentials: this.clientSecret
		});
		const tokens: AuthentikTokens = {
			accessToken: result.access_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			refreshToken: result.refresh_token ?? null,
			idToken: result.id_token
		};
		return tokens;
	}

	public async refreshAccessToken(refreshToken: string): Promise<AuthentikTokens> {
		const result = await this.client.refreshAccessToken<TokenResponseBody>(refreshToken, {
			credentials: this.clientSecret
		});
		const tokens: AuthentikTokens = {
			accessToken: result.access_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			refreshToken: result.refresh_token ?? null,
			idToken: result.id_token
		};
		return tokens;
	}
}

interface TokenResponseBody {
	access_token: string;
	expires_in: number;
	refresh_token?: string;
	id_token: string;
}

export interface AuthentikTokens {
	accessToken: string;
	accessTokenExpiresAt: Date;
	refreshToken: string | null;
	idToken: string;
}
