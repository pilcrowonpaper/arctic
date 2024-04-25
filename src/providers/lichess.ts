import { OAuth2Client } from "oslo/oauth2";
import type { OAuth2ProviderWithPKCE } from "../index.js";

const authorizeEndpoint = "https://lichess.org/oauth";
const tokenEndpoint = "https://lichess.org/api/token";

export class Lichess implements OAuth2ProviderWithPKCE {
	private client: OAuth2Client;

	constructor(clientId: string, redirectURI: string) {
		this.client = new OAuth2Client(clientId, authorizeEndpoint, tokenEndpoint, {
			redirectURI
		});
	}

	public async createAuthorizationURL(
		state: string,
		codeVerifier: string,
		options?: {
			scopes?: string[];
		}
	): Promise<URL> {
		return await this.client.createAuthorizationURL({
			state,
			scopes: options?.scopes ?? [],
			codeVerifier
		});
	}

	public async validateAuthorizationCode(
		code: string,
		codeVerifier: string
	): Promise<LichessTokens> {
		const result = await this.client.validateAuthorizationCode(code, {
			codeVerifier
		});
		const tokens: LichessTokens = {
			accessToken: result.access_token
		};
		return tokens;
	}
}

export interface LichessTokens {
	accessToken: string;
}
