import { TimeSpan, createDate } from "oslo";
import { OAuth2Controller } from "oslo/oauth2";
import { sendRequest } from "../request.js";

const authorizeEndpoint = "https://accounts.google.com/o/oauth2/v2/auth";
const tokenEndpoint = "https://oauth2.googleapis.com/token";

export class Google {
	private controller: OAuth2Controller;
	private scope: string[];
	private clientSecret: string;
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
		this.controller = new OAuth2Controller(clientId, authorizeEndpoint, tokenEndpoint, {
			redirectURI
		});
		this.scope = options?.scope ?? [];
		this.scope.push("https://www.googleapis.com/auth/userinfo.profile");
		this.clientSecret = clientSecret;
		this.accessType = options?.accessType ?? "online";
	}

	public async createAuthorizationURL(state: string): Promise<URL> {
		const url = await this.controller.createAuthorizationURL({
			state,
			scope: this.scope
		});
		url.searchParams.set("access_type", this.accessType);
		return url;
	}

	public async validateAuthorizationCode(code: string): Promise<GoogleTokens> {
		const result = await this.controller.validateAuthorizationCode<AuthorizationCodeResponseBody>(
			code,
			{
				authenticateWith: "request_body",
				credentials: this.clientSecret
			}
		);
		return {
			accessToken: result.access_token,
			refreshToken: result.refresh_token ?? null,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s"))
		};
	}

	public async getUser(accessToken: string): Promise<GoogleUser> {
		const request = new Request("https://www.googleapis.com/oauth2/v3/userinfo");
		request.headers.set("Authorization", ["Bearer", accessToken].join(" "));
		return await sendRequest<GoogleUser>(request);
	}

	public async refreshAccessToken(refreshToken: string): Promise<GoogleRefreshedTokens> {
		const result = await this.controller.refreshAccessToken<RefreshTokenResponseBody>(
			refreshToken,
			{
				authenticateWith: "request_body",
				credentials: this.clientSecret
			}
		);
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
}

interface RefreshTokenResponseBody {
	access_token: string;
	expires_in: number;
}

export interface GoogleTokens {
	accessToken: string;
	refreshToken: string | null;
	accessTokenExpiresAt: Date;
}

export interface GoogleRefreshedTokens {
	accessToken: string;
	accessTokenExpiresAt: Date;
}

export interface GoogleUser {
	sub: string;
	name: string;
	given_name: string;
	family_name: string;
	picture: string;
	locale: string;
	email?: string;
	email_verified?: boolean;
	hd?: string;
}
