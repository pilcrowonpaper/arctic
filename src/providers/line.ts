import { OAuth2Client, generateState } from "oslo/oauth2";
import { TimeSpan, createDate } from "oslo";

import type { OAuth2ProviderWithPKCE } from "../index.js";

const authorizeEndpoint = "https://access.line.me/oauth2/v2.1/authorize";
const tokenEndpoint = "https://api.line.me/oauth2/v2.1/token";

export class Line implements OAuth2ProviderWithPKCE {
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
		this.scope.push("profile", "openid");
		this.clientSecret = clientSecret;
	}

	public async createAuthorizationURL(codeVerifier: string): Promise<URL> {
		return await this.client.createAuthorizationURL({
			state: generateState(),
			codeVerifier,
			scope: this.scope
		});
	}

	public async validateAuthorizationCode(code: string, codeVerifier: string): Promise<LineTokens> {
		const result = await this.client.validateAuthorizationCode<AuthorizationCodeResponseBody>(
			code,
			{
				authenticateWith: "request_body",
				credentials: this.clientSecret,
				codeVerifier
			}
		);
		return {
			accessToken: result.access_token,
			refreshToken: result.refresh_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			idToken: result.id_token
		};
	}

	public async getUser(accessToken: string): Promise<LineUser> {
		const response = await fetch("https://api.line.me/v2/profile", {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});
		return await response.json();
	}

	public async refreshAccessToken(refreshToken: string): Promise<LineRefreshedTokens> {
		const result = await this.client.refreshAccessToken<RefreshTokenResponseBody>(refreshToken, {
			authenticateWith: "request_body",
			credentials: this.clientSecret
		});
		return {
			accessToken: result.access_token,
			refreshToken: result.refresh_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s"))
		};
	}
}

interface AuthorizationCodeResponseBody {
	access_token: string;
	expires_in: number;
	refresh_token: string;
	id_token: string;
}
interface RefreshTokenResponseBody {
	access_token: string;
	expires_in: number;
	refresh_token: string;
}

export interface LineRefreshedTokens {
	accessToken: string;
	refreshToken: string;
	accessTokenExpiresAt: Date;
}

export interface LineTokens {
	accessToken: string;
	refreshToken: string;
	accessTokenExpiresAt: Date;
	idToken: string;
}

export interface LineUser {
	sub: string;
	name: string;
	picture: string;
}
