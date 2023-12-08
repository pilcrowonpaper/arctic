import { OAuth2Client } from "oslo/oauth2";
import { TimeSpan, createDate } from "oslo";

import type { OAuth2Provider } from "../index.js";

const authorizeEndpoint = "https://www.dropbox.com/oauth2/authorize";
const tokenEndpoint = "https://www.dropbox.com/oauth2/token";
const userEndpoint = "https://api.dropboxapi.com/2/users/get_current_account";

export class Dropbox implements OAuth2Provider {
	private client: OAuth2Client;
	private clientSecret: string;
	private scope: string[];
	private accessType: "online" | "offline";

	constructor(
		clientId: string,
		clientSecret: string,
		redirectURI: string,
		options?: {
			scope?: string[];
			accessType?: "online" | "offline";
		}
	) {
		this.client = new OAuth2Client(clientId, authorizeEndpoint, tokenEndpoint, {
			redirectURI
		});
		this.clientSecret = clientSecret;
		this.scope = options?.scope ?? [];
		this.scope.push("account_info.read", "openid", "profile");
		this.accessType = options?.accessType ?? "online";
	}

	public async createAuthorizationURL(state: string): Promise<URL> {
		const url = await this.client.createAuthorizationURL({
			scope: this.scope,
			state
		});
		const tokenAccessType = this.accessType ?? "online";
		url.searchParams.set("token_access_type", tokenAccessType);
		return url;
	}

	public async validateAuthorizationCode(code: string): Promise<DropboxTokens> {
		const result = await this.client.validateAuthorizationCode<AuthorizationCodeResponseBody>(
			code,
			{
				credentials: this.clientSecret
			}
		);
		return {
			accessToken: result.access_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			refreshToken: result.refresh_token ?? null,
			idToken: result.id_token
		};
	}

	public async getUser(accessToken: string): Promise<DropboxUser> {
		const response = await fetch(userEndpoint, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});
		return await response.json();
	}

	public async refreshAccessToken(refreshToken: string): Promise<DropboxRefreshedTokens> {
		const result = await this.client.refreshAccessToken<RefreshTokenResponseBody>(refreshToken, {
			credentials: this.clientSecret
		});
		return {
			accessToken: result.access_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s"))
		};
	}
}

interface AuthorizationCodeResponseBody {
	access_token: string;
	expires_in: number;
	refresh_token?: string;
	id_token: string;
}

interface RefreshTokenResponseBody {
	access_token: string;
	expires_in: number;
}

export interface DropboxTokens {
	accessToken: string;
	accessTokenExpiresAt: Date;
	refreshToken: string | null;
	idToken: string;
}

export interface DropboxRefreshedTokens {
	accessToken: string;
	accessTokenExpiresAt: Date;
}

export interface DropboxUser {
	account_id: string;
	country: string;
	disabled: boolean;
	email: string;
	email_verified: boolean;

	locale: string;
	name: {
		abbreviated_name: string;
		display_name: string;
		familiar_name: string;
		given_name: string;
		surname: string;
	};
	profile_photo_url: string;
}
