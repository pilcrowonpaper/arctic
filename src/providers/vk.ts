import { OAuth2Client } from "oslo/oauth2";
import { TimeSpan, createDate } from "oslo";

import type { OAuth2Provider } from "../index.js";

const authorizeEndpoint = "https://oauth.vk.com/authorize";
const tokenEndpoint = "https://oauth.vk.com/access_token";

export class VK implements OAuth2Provider {
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

	public async validateAuthorizationCode(code: string): Promise<VKTokens> {
		const result = await this.client.validateAuthorizationCode<TokenResponseBody>(code, {
			authenticateWith: "request_body",
			credentials: this.clientSecret
		});
		const tokens: VKTokens = {
			accessToken: result.access_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			userId: result.user_id,
			email: result.email ?? null
		};
		return tokens;
	}
}

interface TokenResponseBody {
	access_token: string;
	expires_in: number;
	user_id: string;
	email?: string;
}

export interface VKTokens {
	accessToken: string;
	accessTokenExpiresAt: Date;
	userId: string;
	email: string | null;
}
