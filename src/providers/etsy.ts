import { OAuth2Client } from "oslo/oauth2";

import type { OAuth2Provider } from "../index.js";

export class Etsy implements OAuth2Provider {
	private client: OAuth2Client;
	private clientSecret: string;

	constructor(
		clientId: string,
		clientSecret: string,
		options?: {
			redirectURI?: string;
			responseType?: "code" | "token";
		}
	) {
		const baseUrl = "https://www.etsy.com/oauth";
		const v3BaseUrl = "https://api.etsy.com/v3/public/oauth";

		const authorizeEndpoint = baseUrl + "/connect";
		const tokenEndpoint = v3BaseUrl + "/token";

		this.client = new OAuth2Client(clientId, authorizeEndpoint, tokenEndpoint, {
			redirectURI: options?.redirectURI
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

	public async validateAuthorizationCode(code: string): Promise<EtsyTokens> {
		const result = await this.client.validateAuthorizationCode(code, {
			authenticateWith: "request_body",
			credentials: this.clientSecret
		});
		const tokens: EtsyTokens = {
			accessToken: result.access_token,
			refreshToken: result.refresh_token
		};
		return tokens;
	}
}

export interface EtsyTokens {
	accessToken: string;
	refreshToken: string | undefined;
}
