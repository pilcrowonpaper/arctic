import { TimeSpan, createDate } from "oslo";
import { OAuth2Client } from "oslo/oauth2";

const authorizeEndpoint = "https://www.facebook.com/v16.0/dialog/oauth";
const tokenEndpoint = "https://graph.facebook.com/v16.0/oauth/access_token";

export class Facebook {
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

	public async validateAuthorizationCode(code: string): Promise<FacebookTokens> {
		const result = await this.client.validateAuthorizationCode<TokenResponseBody>(code, {
			authenticateWith: "request_body",
			credentials: this.clientSecret
		});
		return {
			accessToken: result.access_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s"))
		};
	}

	public async getUser(accessToken: string): Promise<FacebookUser> {
		const url = new URL("https://graph.facebook.com/me");
		url.searchParams.set("access_token", accessToken);
		url.searchParams.set("fields", ["id", "name", "picture", "email"].join(","));
		const response = await fetch(url, {
			headers: {
				Authorization: ["Bearer", accessToken].join(" ")
			}
		});
		return await response.json();
	}
}

interface TokenResponseBody {
	access_token: string;
	expires_in: number;
}

export interface FacebookTokens {
	accessToken: string;
	accessTokenExpiresAt: Date;
}

export interface FacebookUser {
	id: string;
	name: string;
	email?: string;
	picture: {
		data: {
			height: number;
			is_silhouette: boolean;
			url: string;
			width: number;
		};
	};
}
