import { OAuth2Client } from "oslo/oauth2";

import type { OAuth2Provider } from "../index.js";

export class GitHub implements OAuth2Provider {
	private client: OAuth2Client;
	private clientSecret: string;

	constructor(
		clientId: string,
		clientSecret: string,
		options?: {
			redirectURI?: string;
			/** Configuration for usage with [GitHub Enterprise Server](https://docs.github.com/en/enterprise-server/get-started). */
			enterprise?: {
				/** The base URL of your GitHub Enterprise Server instance. */
				baseUrl?: string;
			};
		}
	) {
		const baseUrl = options?.enterprise?.baseUrl ?? "https://github.com";

		const authorizeEndpoint = `${baseUrl}/login/oauth/authorize`;
		const tokenEndpoint = `${baseUrl}/login/oauth/access_token`;

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

	public async validateAuthorizationCode(code: string): Promise<GitHubTokens> {
		const result = await this.client.validateAuthorizationCode(code, {
			authenticateWith: "request_body",
			credentials: this.clientSecret
		});
		const tokens: GitHubTokens = {
			accessToken: result.access_token
		};
		return tokens;
	}
}

export interface GitHubTokens {
	accessToken: string;
}
