import { OAuth2Client } from "oslo/oauth2";
import type { OAuth2Provider } from "../index.js";

const authorizeEndpoint = "https://anilist.co/api/v2/oauth/authorize";
const tokenEndpoint = "https://anilist.co/api/v2/oauth/token";

export class AniList implements OAuth2Provider {
	private client: OAuth2Client;
	private clientSecret: string;

	constructor(clientId: string, clientSecret: string, redirectURI: string) {
		this.client = new OAuth2Client(clientId, authorizeEndpoint, tokenEndpoint, {
			redirectURI
		});
		this.clientSecret = clientSecret;
	}

	public async createAuthorizationURL(state: string): Promise<URL> {
		return await this.client.createAuthorizationURL({
			state
		});
	}

	public async validateAuthorizationCode(code: string): Promise<AniListTokens> {
		const result = await this.client.validateAuthorizationCode<TokenResponseBody>(code, {
			credentials: this.clientSecret
		});
		const tokens: AniListTokens = {
			accessToken: result.access_token
		};
		return tokens;
	}
}

interface TokenResponseBody {
	access_token: string;
}

export interface AniListTokens {
	accessToken: string;
}
