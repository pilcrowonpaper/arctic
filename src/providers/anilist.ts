import { OAuth2Client } from "../client.js";

import type { OAuth2Tokens } from "../oauth2.js";

const authorizationEndpoint = "https://anilist.co/api/v2/oauth/authorize";
const tokenEndpoint = "https://anilist.co/api/v2/oauth/token";

export class AniList {
	private client: OAuth2Client;

	constructor(clientId: string, clientSecret: string, redirectURI: string) {
		this.client = new OAuth2Client(clientId, clientSecret, redirectURI);
	}

	public createAuthorizationURL(state: string): URL {
		const url = this.client.createAuthorizationURL(authorizationEndpoint, state, []);
		return url;
	}

	public async validateAuthorizationCode(code: string): Promise<OAuth2Tokens> {
		const tokens = await this.client.validateAuthorizationCode(tokenEndpoint, code, null);
		return tokens;
	}
}
