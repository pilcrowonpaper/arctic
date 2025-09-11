import { OAuth2Client } from "../client.js";
import type { OAuth2Provider, OAuth2AuthorizationOptions, OAuth2ValidationOptions } from "../provider.js";

import type { OAuth2Tokens } from "../oauth2.js";

const authorizationEndpoint = "https://slack.com/openid/connect/authorize";
const tokenEndpoint = "https://slack.com/api/openid.connect.token";

export class Slack implements OAuth2Provider<["state", "scopes"], ["code"]> {
	private client: OAuth2Client;

	constructor(clientId: string, clientSecret: string, redirectURI: string | null) {
		this.client = new OAuth2Client(clientId, clientSecret, redirectURI);
	}

	public createAuthorizationURL(options: Pick<OAuth2AuthorizationOptions, "state" | "scopes">): URL {
		const { state, scopes = [] } = options;
		const url = this.client.createAuthorizationURL(authorizationEndpoint, state, scopes);
		return url;
	}

	public async validateAuthorizationCode(options: Pick<OAuth2ValidationOptions, "code">): Promise<OAuth2Tokens> {
		const { code } = options;
		const tokens = await this.client.validateAuthorizationCode(tokenEndpoint, code, null);
		return tokens;
	}
}
