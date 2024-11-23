import { OAuth2Client } from "../client.js";

import type { OAuth2Tokens } from "../oauth2.js";

export class Auth0 {
	private authorizationEndpoint: string;
	private tokenEndpoint: string;
	private tokenRevocationEndpoint: string;

	private client: OAuth2Client;

	constructor(domain: string, clientId: string, clientSecret: string, redirectURI: string) {
		this.authorizationEndpoint = `https://${domain}/authorize`;
		this.tokenEndpoint = `https://${domain}/oauth/token`;
		this.tokenRevocationEndpoint = `https://${domain}/oauth/revoke`;
		this.client = new OAuth2Client(clientId, clientSecret, redirectURI);
	}

	public createAuthorizationURL(state: string, scopes: string[]): URL {
		const url = this.client.createAuthorizationURL(this.authorizationEndpoint, state, scopes);
		return url;
	}

	public async validateAuthorizationCode(code: string): Promise<OAuth2Tokens> {
		const tokens = await this.client.validateAuthorizationCode(this.tokenEndpoint, code, null);
		return tokens;
	}

	public async refreshAccessToken(refreshToken: string): Promise<OAuth2Tokens> {
		const tokens = await this.client.refreshAccessToken(this.tokenEndpoint, refreshToken, []);
		return tokens;
	}

	public async revokeToken(token: string): Promise<void> {
		await this.client.revokeToken(this.tokenRevocationEndpoint, token);
	}
}
