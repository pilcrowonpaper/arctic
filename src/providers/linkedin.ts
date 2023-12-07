import { OAuth2Client } from "oslo/oauth2";

const authorizeEndpoint = "https://www.linkedin.com/oauth/v2/authorization";
const tokenEndpoint = "https://www.linkedin.com/oauth/v2/accessToken";

export class LinkedIn {
	private client: OAuth2Client;
	private scope: string[];
	private clientSecret: string;

	constructor(
		clientId: string,
		clientSecret: string,
		redirectURI: string,
		options?: {
			scope?: string[];
		}
	) {
		this.client = new OAuth2Client(clientId, authorizeEndpoint, tokenEndpoint, {
			redirectURI
		});
		this.scope = options?.scope ?? [];
		this.clientSecret = clientSecret;
	}

	public async createAuthorizationURL(state: string): Promise<URL> {
		return await this.client.createAuthorizationURL({
			state,
			scope: this.scope
		});
	}

	public async validateAuthorizationCode(code: string): Promise<LinkedInTokens> {
		const result = await this.client.validateAuthorizationCode<TokenResponseBody>(code, {
			authenticateWith: "request_body",
			credentials: this.clientSecret
		});
		return {
			accessToken: result.access_token,
			accessTokenExpiresIn: result.expires_in,
			refreshToken: result.refresh_token,
			refreshTokenExpiresIn: result.refresh_token_expires_in,
			scope: result.scope
		};
	}

	public async getUser(accessToken: string): Promise<LinkedInUser> {
		const response = await fetch("https://api.linkedin.com/v2/userinfo", {
			headers: {
				Authorization: ["Bearer", accessToken].join(" ")
			}
		});
		return await response.json();
	}

	public async refreshAccessToken(refreshToken: string): Promise<LinkedInTokens> {
		const result = await this.client.refreshAccessToken<TokenResponseBody>(refreshToken, {
			authenticateWith: "request_body",
			credentials: this.clientSecret
		});
		return {
			accessToken: result.access_token,
			accessTokenExpiresIn: result.expires_in,
			refreshToken: result.refresh_token,
			refreshTokenExpiresIn: result.refresh_token_expires_in,
			scope: result.scope
		};
	}
}

interface TokenResponseBody {
	access_token: string;
	expires_in: number;
	refresh_token: string;
	refresh_token_expires_in: number;
	scope: string;
}

export type LinkedInTokens = {
	accessToken: string;
	accessTokenExpiresIn: number;
	refreshToken: string;
	refreshTokenExpiresIn: number;
	scope: string;
};

export type LinkedInUser = {
	sub: string;
	name: string;
	email: string;
	email_verified: boolean;
	given_name: string;
	family_name: string;
	locale: {
		country: string;
		language: string;
	};
	picture: string;
};
