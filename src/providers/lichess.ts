import { OAuth2Client } from "oslo/oauth2";
import type { OAuth2ProviderWithPKCE} from "../index.js";

const authorizeEndpoint = "https://lichess.org/oauth";
const tokenEndpoint = "https://lichess.org/api/token";

export class Lichess implements OAuth2ProviderWithPKCE {
	private client: OAuth2Client;
	private clientSecret: string;
	private clientId: string;
	private options: {
		redirectURI: string;
		scope: string[];
	};

	constructor(
		clientId: string,
		clientSecret: string,
		options: {
			redirectURI: string;
			scope: string[];
		}
	) {
		this.client = new OAuth2Client(clientId, authorizeEndpoint, tokenEndpoint, {
			redirectURI: options?.redirectURI
		});
		this.clientSecret = clientSecret;
		this.options = options;
		this.clientId = clientId;
	}

	public async createAuthorizationURL(
		state: string,
		codeVerifier: string,
		options?: {
			scope: string[];
		}
	): Promise<URL> {
		return await this.client.createAuthorizationURL({
			state,
			scopes: options?.scope ?? [],
			codeVerifier
		});
	}

	public async validateAuthorizationCode(code: string, codeVerifier: string): Promise<LichessTokens> {
		const options: ValidateAuthorizationCodeRequestOptions = {
			authenticateWith: "request_body",
			clientId: this.clientId,
			codeVerifier,
			redirectURI: this.options.redirectURI,
			credentials: this.clientSecret
		};

		const result = await this.client.validateAuthorizationCode(code, options);
		const tokens: LichessTokens = {
			accessToken: result.access_token
		};
		return tokens;
	}
}

interface ValidateAuthorizationCodeRequestOptions {
    authenticateWith: "request_body" | undefined,
    clientId: string,
    codeVerifier: string,
    redirectURI: string,
    credentials: string
}

export interface LichessTokens {
	accessToken: string;
}
