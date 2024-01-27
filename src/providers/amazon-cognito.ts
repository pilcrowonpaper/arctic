import { TimeSpan, createDate } from "oslo";
import { OAuth2Client } from "oslo/oauth2";

import type { OAuth2ProviderWithPKCE } from "../index.js";

export class AmazonCognito implements OAuth2ProviderWithPKCE {
	private client: OAuth2Client;
	private clientSecret: string;

	constructor(userPoolDomain: string, clientId: string, clientSecret: string, redirectURI: string) {
		const authorizeEndpoint = userPoolDomain + "/oauth2/authorize";
		const tokenEndpoint = userPoolDomain + "/oauth2/token";
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
	): Promise<AmazonCognitoTokens> {
		const result = await this.client.validateAuthorizationCode<AuthorizationCodeResponseBody>(
			code,
			{
				credentials: this.clientSecret,
				codeVerifier
			}
		);
		const tokens: AmazonCognitoTokens = {
			accessToken: result.access_token,
			refreshToken: result.refresh_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			idToken: result.id_token
		};
		return tokens;
	}

	public async refreshAccessToken(refreshToken: string): Promise<AmazonCognitoRefreshedTokens> {
		const result = await this.client.refreshAccessToken<RefreshTokenResponseBody>(refreshToken, {
			credentials: this.clientSecret
		});
		const tokens: AmazonCognitoRefreshedTokens = {
			accessToken: result.access_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			idToken: result.id_token
		};
		return tokens;
	}
}

interface AuthorizationCodeResponseBody {
	access_token: string;
	refresh_token: string;
	expires_in: number;
	id_token: string;
}

interface RefreshTokenResponseBody {
	access_token: string;
	expires_in: number;
	id_token: string;
}

export interface AmazonCognitoTokens {
	accessToken: string;
	refreshToken: string;
	accessTokenExpiresAt: Date;
	idToken: string;
}

export interface AmazonCognitoRefreshedTokens {
	accessToken: string;
	accessTokenExpiresAt: Date;
	idToken: string;
}
