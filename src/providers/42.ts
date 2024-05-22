import { OAuth2Client } from "oslo/oauth2";

import type { OAuth2Provider } from "../index.js";
import { createDate, TimeSpan } from "oslo";

const authorizeEndpoint = "https://api.intra.42.fr/oauth/authorize";
const tokenEndpoint = "https://api.intra.42.fr/oauth/token";

export class FortyTwo implements OAuth2Provider {
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

	public async validateAuthorizationCode(code: string): Promise<FortyTwoTokens> {
		const result = await this.client.validateAuthorizationCode<TokenResponseBody>(code, {
			authenticateWith: "request_body",
			credentials: this.clientSecret
		});
		const tokens: FortyTwoTokens = {
			accessToken: result.access_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s"))
		};
		return tokens;
	}
}

interface TokenResponseBody {
	access_token: string;
	token_type: string;
	expires_in: number;
	scope: string;
	created_at: number;
}

export interface FortyTwoTokens {
	accessToken: string;
	accessTokenExpiresAt: Date;
}
