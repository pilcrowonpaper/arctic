import { TimeSpan, createDate } from "oslo";
import { parseJWT } from "oslo/jwt";
import { OAuth2Client } from "oslo/oauth2";

const authorizeEndpoint = "https://access.line.me/oauth2/v2.1/authorize";
const tokenEndpoint = "https://api.line.me/oauth2/v2.1/token";

export class Line {
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
		this.scope.push("profile", "openid");
		this.clientSecret = clientSecret;
	}

	public async createAuthorizationURL(state: string): Promise<URL> {
		return await this.client.createAuthorizationURL({
			state,
			scope: this.scope
		});
	}

	public async validateAuthorizationCode(code: string): Promise<LineTokens> {
		const result = await this.client.validateAuthorizationCode<AuthorizationCodeResponseBody>(
			code,
			{
				authenticateWith: "request_body",
				credentials: this.clientSecret
			}
		);
		const parsedIdToken = parseJWT(result.id_token);
		if (!parsedIdToken) throw new Error("Failed to parse ID token");
		const idTokenClaims = parsedIdToken.payload as unknown as LineIdTokenClaims;
		return {
			accessToken: result.access_token,
			refreshToken: result.refresh_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			idToken: result.id_token,
			idTokenClaims
		};
	}

	public async getUser(accessToken: string): Promise<LineUser> {
		const response = await fetch("https://api.line.me/v2/profile", {
			headers: {
				Authorization: ["Bearer", accessToken].join(" ")
			}
		});
		return await response.json();
	}

	public async refreshAccessToken(refreshToken: string): Promise<LineRefreshedTokens> {
		const result = await this.client.refreshAccessToken<RefreshTokenResponseBody>(
			refreshToken,
			{
				authenticateWith: "request_body",
				credentials: this.clientSecret
			}
		);
		return {
			accessToken: result.access_token,
			refreshToken: result.refresh_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s"))
		};
	}
}

export interface LineIdTokenClaims {
	iss: "https://access.line.me";
	sub: string;
	aud: string;
	exp: number;
	iat: number;
	auth_time?: number;
	amr?: string[];
	name: string;
	picture: string;
	email?: string;
}

interface AuthorizationCodeResponseBody {
	access_token: string;
	expires_in: number;
	refresh_token: string;
	id_token: string;
}
interface RefreshTokenResponseBody {
	access_token: string;
	expires_in: number;
	refresh_token: string;
}

export interface LineRefreshedTokens {
	accessToken: string;
	refreshToken: string;
	accessTokenExpiresAt: Date;
}

export interface LineTokens {
	accessToken: string;
	refreshToken: string;
	accessTokenExpiresAt: Date;
	idToken: string;
	idTokenClaims: LineIdTokenClaims;
}

export interface LineUser {
	sub: string;
	name: string;
	picture: string;
}
