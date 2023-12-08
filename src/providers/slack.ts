import { OAuth2Client } from "oslo/oauth2";

import type { OAuth2ProviderWithPKCE } from "../index.js";

const authorizeEndpoint = "https://slack.com/openid/connect/authorize";
const tokenEndpoint = "https://slack.com/api/openid.connect.token";

export class Slack implements OAuth2ProviderWithPKCE {
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
		this.scope.push("openid", "profile");
		this.clientSecret = clientSecret;
	}

	public async createAuthorizationURL(codeVerifier: string): Promise<URL> {
		return await this.client.createAuthorizationURL({
			codeVerifier,
			scope: this.scope
		});
	}

	public async validateAuthorizationCode(code: string, codeVerifier: string): Promise<SlackTokens> {
		const result = await this.client.validateAuthorizationCode<TokenResponseBody>(code, {
			authenticateWith: "request_body",
			credentials: this.clientSecret,
			codeVerifier
		});
		return {
			accessToken: result.access_token,
			idToken: result.id_token
		};
	}

	public async getUser(accessToken: string): Promise<SlackUser> {
		const response = await fetch("https://slack.com/api/openid.connect.userInfo", {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});
		return await response.json();
	}
}

interface TokenResponseBody {
	access_token: string;
	id_token: string;
}

export interface SlackTokens {
	accessToken: string;
	idToken: string;
}

export interface SlackUser {
	sub: string;
	"https://slack.com/user_id": string;
	"https://slack.com/team_id": string;
	email?: string;
	email_verified: boolean;
	date_email_verified: number;
	name: string;
	picture: string;
	given_name: string;
	family_name: string;
	locale: string;
	"https://slack.com/team_name": string;
	"https://slack.com/team_domain": string;
	"https://slack.com/user_image_24": string;
	"https://slack.com/user_image_32": string;
	"https://slack.com/user_image_48": string;
	"https://slack.com/user_image_72": string;
	"https://slack.com/user_image_192": string;
	"https://slack.com/user_image_512": string;
	"https://slack.com/team_image_34": string;
	"https://slack.com/team_image_44": string;
	"https://slack.com/team_image_68": string;
	"https://slack.com/team_image_88": string;
	"https://slack.com/team_image_102": string;
	"https://slack.com/team_image_132": string;
	"https://slack.com/team_image_230": string;
	"https://slack.com/team_image_default": true;
}
