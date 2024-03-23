import { OAuth2Client } from "oslo/oauth2";

import type { OAuth2Provider } from "../index.js";

const defaultAuthorizeEndpoint = "https://github.com/login/oauth/authorize";
const defaultTokenEndpoint = "https://github.com/login/oauth/access_token";

export class GitHub implements OAuth2Provider {
	private client: OAuth2Client;
	private clientSecret: string;

	constructor(
		clientId: string,
		clientSecret: string,
		options?: {
			authorizeEndpoint?: string;
			tokenEndpoint?: string;
			redirectURI?: string;
		}
	) {
		// Set the authorize and token endpoints to the default GitHub endpoints if not provided
		// Enables usage with GitHub Enterprise instances
		const authorizeEndpoint = options?.authorizeEndpoint ?? defaultAuthorizeEndpoint;
		const tokenEndpoint = options?.tokenEndpoint ?? defaultTokenEndpoint;

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
