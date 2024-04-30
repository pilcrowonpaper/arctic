import { OAuth2Client } from "oslo/oauth2";
import { TimeSpan, createDate } from "oslo";
import type { OAuth2ProviderWithPKCE } from "../index.js";

export class Authentik implements OAuth2ProviderWithPKCE {
	private client: OAuth2Client;
	private realmURL: string;
	private clientSecret: string;

	constructor(realmURL: string, clientId: string, clientSecret: string, redirectURI: string) {
		this.realmURL = realmURL;
		const authorizeEndpoint = this.realmURL + "/application/o/authorize/";
		const tokenEndpoint = this.realmURL + "/application/o/token/";
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
			scopes: [...scopes]
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
			refreshToken: result.refresh_token,
			tokenType: result.token_type,
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
			tokenType: result.token_type,
			refreshToken: result.refresh_token,
			idToken: result.id_token
		};
		return tokens;
	}
}

interface TokenResponseBody {
	access_token: string;
	expires_in: number;
	token_type: string;
	refresh_token: string;
	id_token: string;
}

export interface AuthentikTokens {
	accessToken: string;
	accessTokenExpiresAt: Date;
	tokenType: string;
	refreshToken: string;
	idToken: string;
}
