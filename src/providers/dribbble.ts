import { OAuth2Client } from "oslo/oauth2";

import type { OAuth2Provider } from "../index.js";

const authorizeEndpoint = "https://dribbble.com/oauth/authorize";
const tokenEndpoint = "https://dribbble.com/oauth/token";

export class Dribbble implements OAuth2Provider {
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

	public async validateAuthorizationCode(code: string): Promise<DribbbleTokens> {
		const result = await this.client.validateAuthorizationCode<AuthorizationCodeResponseBody>(
			code,
			{
				authenticateWith: "request_body",
				credentials: this.clientSecret
			}
		);
		const tokens: DribbbleTokens = {
			accessToken: result.access_token,
		};
		return tokens;
	}
}

interface AuthorizationCodeResponseBody {
	access_token: string;
}

export interface DribbbleTokens {
	accessToken: string;
}
