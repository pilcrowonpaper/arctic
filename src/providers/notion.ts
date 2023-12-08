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
		return {
			accessToken: result.access_token,
			user: result.owner,
			botId: result.bot_id
		};
	}
}

interface TokenResponseBody {
	access_token: string;
	owner: NotionUser;
	bot_id: string;
}

export interface NotionTokens {
	accessToken: string;
	user: NotionUser;
	botId: string;
}

export interface NotionUser {
	type: "person";
	id: string;
	name: string;
	avatar_url: string;
	person: NotionPersonUser;
}

export interface NotionPersonUser {
	email: string;
}
