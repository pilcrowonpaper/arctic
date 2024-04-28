import { TimeSpan, createDate } from "oslo";
import { OAuth2Client } from "oslo/oauth2";

import type { OAuth2Provider } from "../index.js";

const authorizeEndpoint = "https://v5api.tiltify.com/oauth/authorizeze";
const tokenEndpoint = "https://v5api.tiltify.com/oauth/token";

export class Tiltify implements OAuth2Provider {
	private client: OAuth2Client;
	private clientSecret: string;

	constructor(clientId: string, clientSecret: string, redirectURI: string) {
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
		return await this.client.createAuthorizationURL({
			state,
			scopes: options?.scopes ?? []
		});
	}

	public async validateAuthorizationCode(code: string): Promise<TiltifyTokens> {
		const result = await this.client.validateAuthorizationCode<TokenResponseBody>(code, {
			authenticateWith: "request_body",
			credentials: this.clientSecret
		});
		const tokens: TiltifyTokens = {
			accessToken: result.access_token,
			refreshToken: result.refresh_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s"))
		};
		return tokens;
	}

	public async refreshAccessToken(refreshToken: string): Promise<TiltifyTokens> {
		const result = await this.client.refreshAccessToken<TokenResponseBody>(refreshToken, {
			authenticateWith: "request_body",
			credentials: this.clientSecret
		});
		const tokens: TiltifyTokens = {
			accessToken: result.access_token,
			refreshToken: result.refresh_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s"))
		};
		return tokens;
	}
}

interface TokenResponseBody {
	access_token: string;
	expires_in: number;
	refresh_token: string;
}

export interface TiltifyTokens {
	accessToken: string;
	refreshToken: string;
	accessTokenExpiresAt: Date;
}
