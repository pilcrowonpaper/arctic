import { OAuth2Client, generateState } from "oslo/oauth2";

import type { OAuth2ProviderWithPKCE } from "../index.js";

const authorizeEndpoint = "https://login.salesforce.com/services/oauth2/authorize";
const tokenEndpoint = "https://login.salesforce.com/services/oauth2/token";
const userinfoEndpoint = "https://login.salesforce.com/services/oauth2/userinfo";

export class Salesforce implements OAuth2ProviderWithPKCE {
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
		this.scope.push("openid", "id", "profile");
		this.clientSecret = clientSecret;
	}

	public async createAuthorizationURL(codeVerifier: string): Promise<URL> {
		return await this.client.createAuthorizationURL({
			state: generateState(),
			scope: this.scope,
			codeVerifier
		});
	}

	public async validateAuthorizationCode(
		code: string,
		codeVerifier: string
	): Promise<SalesforceToken> {
		const result = await this.client.validateAuthorizationCode<TokenResponseBody>(code, {
			credentials: this.clientSecret,
			codeVerifier
		});
		return {
			accessToken: result.access_token,
			refreshToken: result.refresh_token ?? null,
			idToken: result.id_token
		};
	}

	public async getUser(accesToken: string): Promise<SalesforceUser> {
		const response = await fetch(userinfoEndpoint, {
			headers: {
				Authorization: `Bearer ${accesToken}`
			}
		});
		return await response.json();
	}

	public async refreshAccessToken(refreshToken: string): Promise<SalesforceToken> {
		const result = await this.client.refreshAccessToken<TokenResponseBody>(refreshToken, {
			authenticateWith: "request_body",
			credentials: this.clientSecret
		});
		return {
			accessToken: result.access_token,
			refreshToken: result.refresh_token ?? null,
			idToken: result.id_token
		};
	}
}

interface TokenResponseBody {
	access_token: string;
	refresh_token?: string;
	id_token: string;
}
export interface SalesforceToken {
	accessToken: string;
	idToken: string;
	refreshToken: string | null;
}

export interface SalesforceUser {
	sub: string; // URL
	user_id: string;
	organization_id: string;
	name: string;
	email?: string;
	email_verified: boolean;
	given_name: string;
	family_name: string;
	zoneinfo: string;
	photos: {
		picture: string;
		thumbnail: string;
	};
	profile: string;
	picture: string;
	address?: Record<string, string>;
	urls: Record<string, string>;
	active: boolean;
	user_type: string;
	language: string;
	locale: string;
	utcOffset: number;
	updated_at: string;
}
