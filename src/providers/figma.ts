import { TimeSpan, createDate } from "oslo";
import { OAuth2Client } from "oslo/oauth2";
import { sendRequest } from "../request.js";

import type { OAuth2Provider } from "../index.js";

const authorizeEndpoint = "https://www.figma.com/oauth";
const tokenEndpoint = "https://www.figma.com/api/oauth/token";
const userEndpoint = "https://api.figma.com/v1/me";

export class Figma implements OAuth2Provider {
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
		const url = await this.client.createAuthorizationURL({
			scope: this.scope,
			state
		});
		return url;
	}

	public async validateAuthorizationCode(code: string): Promise<FigmaTokens> {
		const result = await this.client.validateAuthorizationCode<AuthorizationCodeResponseBody>(
			code,
			{
				authenticateWith: "request_body",
				credentials: this.clientSecret
			}
		);
		return {
			accessToken: result.access_token,
			refreshToken: result.refresh_token ?? null,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			userId: result.user_id
		};
	}

	public async getUser(accessToken: string): Promise<FigmaUser> {
		const request = new Request(userEndpoint);
		request.headers.set("Authorization", `Bearer ${accessToken}`);
		return await sendRequest<FigmaUser>(request);
	}

	public async refreshAccessToken(refreshToken: string): Promise<FigmaRefreshedTokens> {
		const result = await this.client.refreshAccessToken<RefreshTokenResponseBody>(refreshToken, {
			authenticateWith: "request_body",
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
	refresh_token?: string;
	expires_in: number;
	user_id: string;
}

interface RefreshTokenResponseBody {
	access_token: string;
	expires_in: number;
}

export interface FigmaTokens {
	userId: string;
	accessToken: string;
	refreshToken: string | null;
	accessTokenExpiresAt: Date;
}

export interface FigmaRefreshedTokens {
	accessToken: string;
	accessTokenExpiresAt: Date;
}

export interface FigmaUser {
	id: string;
	handle: string;
	img_url: string;
	email: string;
}
