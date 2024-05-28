import { OAuth2Client } from "oslo/oauth2";
import type { OAuth2Provider } from "../index.js";
import { createDate, TimeSpan } from "oslo";

const authorizeEndpoint = "https://start.gg/oauth/authorize";
const tokenEndpoint = "https://api.start.gg/oauth/access_token";

export class Startgg implements OAuth2Provider {
	private client: OAuth2Client;
	private clientSecret: string;

	constructor(clientId: string, clientSecret: string, redirectURI: string) {
		this.client = new OAuth2Client(clientId, authorizeEndpoint, tokenEndpoint, {
			redirectURI
		});
		this.clientSecret = clientSecret;
	}

	public async createAuthorizationURL(state: string, options?: { scopes?: string[] }): Promise<URL> {
		return await this.client.createAuthorizationURL({
			state,
			scopes: options?.scopes ?? []
		});
	}

	public async validateAuthorizationCode(code: string): Promise<StartggTokens> {
		const result = await this.client.validateAuthorizationCode<TokenResponseBody>(code, {
			credentials: this.clientSecret
		});
		return {
			accessToken: result.access_token,
			refreshToken: result.refresh_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s"))
		};
	}
}

interface TokenResponseBody {
	access_token: string;
	token_type: string,
	expires_in: number,
	refresh_token: string
}

export interface StartggTokens {
	accessToken: string;
	refreshToken: string;
	accessTokenExpiresAt: Date;
}
