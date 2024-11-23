import { OAuth2Client } from "../client.js";

import type { OAuth2Tokens } from "../oauth2.js";

const authorizationEndpoint = "https://slack.com/openid/connect/authorize";
const tokenEndpoint = "https://slack.com/api/openid.connect.token";

export class Slack {
	private client: OAuth2Client;

	constructor(clientId: string, clientSecret: string, redirectURI: string | null) {
		this.client = new OAuth2Client(clientId, clientSecret, redirectURI);
	}

	public createAuthorizationURL(state: string, scopes: string[]): URL {
		const url = this.client.createAuthorizationURL(authorizationEndpoint, state, scopes);
		return url;
	}

	public async validateAuthorizationCode(code: string): Promise<OAuth2Tokens> {
		const tokens = await this.client.validateAuthorizationCode(tokenEndpoint, code, null);
		return tokens;
	}
}
