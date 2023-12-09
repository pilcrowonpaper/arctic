import { OAuth2Client } from "oslo/oauth2";

import type { OAuth2Provider } from "../index.js";

const authorizeEndpoint = "https://github.com/login/oauth/authorize";
const tokenEndpoint = "https://github.com/login/oauth/access_token";

export class GitHub implements OAuth2Provider {
	private client: OAuth2Client;
	private clientSecret: string;

	constructor(
		clientId: string,
		clientSecret: string,
		options?: {
			redirectURI?: string;
		}
	) {
		this.client = new OAuth2Client(clientId, authorizeEndpoint, tokenEndpoint, {
			redirectURI: options?.redirectURI
		});
		this.clientSecret = clientSecret;
	}

	public async createAuthorizationURL(
		state: string,
		options?: {
			scope?: string[];
		}
	): Promise<URL> {
		return await this.client.createAuthorizationURL({
			state,
			scope: options?.scope ?? []
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
