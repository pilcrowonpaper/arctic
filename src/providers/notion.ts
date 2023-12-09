import { OAuth2Client } from "oslo/oauth2";

import type { OAuth2Provider } from "../index.js";

const authorizeEndpoint = "https://api.notion.com/v1/oauth/authorize";
const tokenEndpoint = "https://api.notion.com/v1/oauth/token";

export class Notion implements OAuth2Provider {
	private client: OAuth2Client;
	private clientSecret: string;

	constructor(clientId: string, clientSecret: string, redirectURI: string) {
		this.client = new OAuth2Client(clientId, authorizeEndpoint, tokenEndpoint, {
			redirectURI
		});
		this.clientSecret = clientSecret;
	}

	public async createAuthorizationURL(state: string): Promise<URL> {
		const url = await this.client.createAuthorizationURL({
			state
		});
		url.searchParams.set("owner", "user");
		return url;
	}

	public async validateAuthorizationCode(code: string): Promise<NotionTokens> {
		const result = await this.client.validateAuthorizationCode<TokenResponseBody>(code, {
			credentials: this.clientSecret
		});
		const tokens: NotionTokens = {
			accessToken: result.access_token
		};
		return tokens;
	}
}

interface TokenResponseBody {
	access_token: string;
}

export interface NotionTokens {
	accessToken: string;
}
