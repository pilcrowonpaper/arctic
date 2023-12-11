import { OAuth2Client } from "oslo/oauth2";
import { TimeSpan, createDate } from "oslo";

import type { OAuth2Provider } from "../index.js";

const authorizeEndpoint = "https://auth.atlassian.com/authorize";
const tokenEndpoint = "https://auth.atlassian.com/token";

export class Atlassian implements OAuth2Provider {
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
		const url = await this.client.createAuthorizationURL({
			scopes: options?.scopes
		});
		url.searchParams.set("state", state);
		url.searchParams.set("audience", "api.atlassian.com");
		url.searchParams.set("prompt", "consent");
		return url;
	}

	public async validateAuthorizationCode(code: string): Promise<AtlassianTokens> {
		const result = await this.client.validateAuthorizationCode<TokenResponseBody>(code, {
			authenticateWith: "request_body",
			credentials: this.clientSecret
		});
		const tokens: AtlassianTokens = {
			accessToken: result.access_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			refreshToken: result.refresh_token ?? null
		};
		return tokens;
	}

	public async refreshAccessToken(refreshToken: string): Promise<AtlassianTokens> {
		const result = await this.client.validateAuthorizationCode<TokenResponseBody>(refreshToken, {
			authenticateWith: "request_body",
			credentials: this.clientSecret
		});
		const tokens: AtlassianTokens = {
			accessToken: result.access_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			refreshToken: result.refresh_token ?? null
		};
		return tokens;
	}
}

interface TokenResponseBody {
	access_token: string;
	expires_in: number;
	refresh_token?: string;
}

export interface AtlassianTokens {
	accessToken: string;
	accessTokenExpiresAt: Date;
	refreshToken: string | null;
}
