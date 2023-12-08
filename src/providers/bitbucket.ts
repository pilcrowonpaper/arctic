import { OAuth2Client } from "oslo/oauth2";
import { TimeSpan, createDate } from "oslo";

import type { OAuth2Provider } from "../index.js";

const authorizeEndpoint = "https://bitbucket.org/site/oauth2/authorize";
const tokenEndpoint = "https://bitbucket.org/site/oauth2/access_token";
const userEndpoint = "https://api.bitbucket.org/2.0/user";

export class Bitbucket implements OAuth2Provider {
	private client: OAuth2Client;
	private clientSecret: string;
	private scope: string[];

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
		this.clientSecret = clientSecret;
		this.scope = options?.scope ?? [];
		this.scope.push("account");
	}

	public async createAuthorizationURL(state: string): Promise<URL> {
		return await this.client.createAuthorizationURL({
			scope: this.scope,
			state
		});
	}
	public async validateAuthorizationCode(code: string): Promise<BitbucketTokens> {
		const result = await this.client.validateAuthorizationCode<TokenResponseBody>(code, {
			credentials: this.clientSecret
		});
		return {
			accessToken: result.access_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			refreshToken: result.refresh_token
		};
	}

	public async getUser(accessToken: string): Promise<BitbucketUser> {
		const response = await fetch(userEndpoint, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});
		return await response.json();
	}

	public async refreshAccessToken(refreshToken: string): Promise<BitbucketTokens> {
		const result = await this.client.refreshAccessToken<TokenResponseBody>(refreshToken, {
			credentials: this.clientSecret
		});
		return {
			accessToken: result.access_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			refreshToken: result.refresh_token
		};
	}
}

interface TokenResponseBody {
	access_token: string;
	expires_in: number;
	refresh_token: string;
}

export interface BitbucketTokens {
	accessToken: string;
	accessTokenExpiresAt: Date;
	refreshToken: string;
}

export interface BitbucketUser {
	type: string;
	links: BitbucketLinks;
	created_on: string;
	display_name: string;
	username: string;
	uuid: string;
}

export interface BitbucketLinks {
	avatar: BitbucketLink;
}

export interface BitbucketLink {
	href: string;
	name: string;
}
