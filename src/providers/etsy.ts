import { OAuth2Client } from "oslo/oauth2";

import type { OAuth2ProviderWithPKCE } from "../index.js";

export class Etsy implements OAuth2ProviderWithPKCE {
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
		codeVerifier: string,
		options?: {
			scopes?: string[];
		}
	): Promise<URL> {
		return await this.client.createAuthorizationURL({
			state,
			codeVerifier,
			scopes: options?.scopes ?? []
		});
	}

	public async validateAuthorizationCode(code: string, codeVerifier: string): Promise<EtsyTokens> {
		const result = await this.client.validateAuthorizationCode(code, {
			authenticateWith: "request_body",
			credentials: this.clientSecret,
			codeVerifier
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
