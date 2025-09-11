import { OAuth2Client } from "../client.js";
import type { OAuth2Provider, OAuth2AuthorizationOptions, OAuth2ValidationOptions } from "../provider.js";

import type { OAuth2Tokens } from "../oauth2.js";

const authorizationEndpoint = "https://anilist.co/api/v2/oauth/authorize";
const tokenEndpoint = "https://anilist.co/api/v2/oauth/token";

export class AniList implements OAuth2Provider<["state"], ["code"]> {
	private client: OAuth2Client;

	constructor(clientId: string, clientSecret: string, redirectURI: string) {
		this.client = new OAuth2Client(clientId, clientSecret, redirectURI);
	}

	public createAuthorizationURL(options: Pick<OAuth2AuthorizationOptions, "state">): URL {
		const { state } = options;
		const url = this.client.createAuthorizationURL(authorizationEndpoint, state, []);
		return url;
	}

	public async validateAuthorizationCode(options: Pick<OAuth2ValidationOptions, "code">): Promise<OAuth2Tokens> {
		const { code } = options;
		const tokens = await this.client.validateAuthorizationCode(tokenEndpoint, code, null);
		return tokens;
	}
}
