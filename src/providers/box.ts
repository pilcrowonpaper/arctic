import { OAuth2Client } from "oslo/oauth2";

import type { OAuth2Provider } from "../index.js";

const authorizeEndpoint = "https://account.box.com/api/oauth2/authorize";
const tokenEndpoint = "https://api.box.com/oauth2/token";

export class Box implements OAuth2Provider {
	private client: OAuth2Client;
	private clientSecret: string;

	constructor(clientId: string, clientSecret: string, redirectURI: string) {
		this.client = new OAuth2Client(clientId, authorizeEndpoint, tokenEndpoint, {
			redirectURI
		});
		this.clientSecret = clientSecret;
	}

	public async createAuthorizationURL(state: string): Promise<URL> {
		return await this.client.createAuthorizationURL({
			state
		});
	}

	public async validateAuthorizationCode(code: string): Promise<BoxTokens> {
		const result = await this.client.validateAuthorizationCode(code, {
			authenticateWith: "request_body",
			credentials: this.clientSecret
		});
		const tokens: BoxTokens = {
			accessToken: result.access_token
		};
		return tokens;
	}
}

export interface BoxTokens {
	accessToken: string;
}
