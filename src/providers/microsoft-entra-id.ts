import { TimeSpan, createDate } from "oslo";
import { OAuth2Client } from "oslo/oauth2";

import type { OAuth2ProviderWithPKCE } from "../index.js";

export class MicrosoftEntraId implements OAuth2ProviderWithPKCE {
	private client: OAuth2Client;
	private clientSecret: string;

	constructor(tenant: string, clientId: string, clientSecret: string, redirectURI: string) {
		const authorizeEndpoint = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize`;
		const tokenEndpoint = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`;
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
		const url = await this.client.createAuthorizationURL({
			state,
			codeVerifier,
			scopes: [...scopes, "openid"]
		});
		url.searchParams.set("nonce", "_");
		return url;
	}

	public async validateAuthorizationCode(
		code: string,
		codeVerifier: string
	): Promise<MicrosoftEntraIdTokens> {
		const result = await this.client.validateAuthorizationCode<TokenResponseBody>(code, {
			credentials: this.clientSecret,
			codeVerifier
		});
		const tokens: MicrosoftEntraIdTokens = {
			accessToken: result.access_token,
			refreshToken: result.refresh_token ?? null,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			idToken: result.id_token
		};
		return tokens;
	}

	public async refreshAccessToken(refreshToken: string): Promise<MicrosoftEntraIdTokens> {
		const result = await this.client.refreshAccessToken<TokenResponseBody>(refreshToken, {
			credentials: this.clientSecret
		});
		const tokens: MicrosoftEntraIdTokens = {
			accessToken: result.access_token,
			refreshToken: result.refresh_token ?? null,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
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

export interface MicrosoftEntraIdTokens {
	idToken: string;
	accessToken: string;
	accessTokenExpiresAt: Date;
	refreshToken: string | null;
}
