import { OAuth2Client } from "oslo/oauth2";
import type { OAuth2ProviderWithPKCE} from "../index.js";

const authorizeEndpoint = "https://lichess.org/oauth";
const tokenEndpoint = "https://lichess.org/api/token";

export class Lichess implements OAuth2ProviderWithPKCE {
	private client: OAuth2Client;
	private clientId: string;
    private redirectURI: string;
	private options?: {
		scopes?: string[];
	};

	constructor(
		clientId: string,
        redirectURI: string,
		options?: {
			scopes?: string[]
		}
	) {
		this.client = new OAuth2Client(clientId, authorizeEndpoint, tokenEndpoint, {
			redirectURI
		});
		this.clientId = clientId;
        this.redirectURI = redirectURI;
		this.options = options ?? {};
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

	public async validateAuthorizationCode(code: string, codeVerifier: string): Promise<LichessTokens> {
		const result = await this.client.validateAuthorizationCode(code, 
            {
                authenticateWith: "request_body",
                codeVerifier,
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
