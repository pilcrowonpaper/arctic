import { OAuth2Client, generateState } from "oslo/oauth2";

import type { OAuth2ProviderWithPKCE } from "../index.js";

const authorizeEndpoint = "/oauth/authorize";
const tokenEndpoint = "/oauth/token";

export class GitLab implements OAuth2ProviderWithPKCE {
	private client: OAuth2Client;
	private clientSecret: string;
	private scope: string[];
	private serverUrl: string;

	constructor(
		clientId: string,
		clientSecret: string,
		redirectURI: string,
		serverUrl?: string,
		options?: {
			scope?: string[];
		}
	) {
		this.serverUrl = serverUrl || "https://gitlab.com";
		this.client = new OAuth2Client(
			clientId,
			`${this.serverUrl}${authorizeEndpoint}`,
			`${this.serverUrl}${tokenEndpoint}`,
			{
				redirectURI
			}
		);
		this.scope = options?.scope ?? [];
		this.scope.push("read_user");
		this.clientSecret = clientSecret;
	}

	public async createAuthorizationURL(codeVerifier: string): Promise<URL> {
		return await this.client.createAuthorizationURL({
			state: generateState(),
			scope: this.scope,
			codeVerifier
		});
	}

	public async getUser(accessToken: string): Promise<GitlabUser> {
		const response = await fetch(`${this.serverUrl}/api/v4/user`, {
			headers: {
				Authorization: ["Bearer", accessToken].join(" ")
			}
		});
		return await response.json();
	}

	public async refreshAccessToken(refreshToken: string): Promise<GitlabTokens> {
		const result = await this.client.refreshAccessToken<TokenResponseBody>(refreshToken, {
			authenticateWith: "request_body",
			credentials: this.clientSecret
		});

		return {
			accessToken: result.access_token,
			accessTokenExpiresIn: result.expires_in,
			refreshToken: result.refresh_token
		};
	}
}

interface TokenResponseBody {
	access_token: string;
	expires_in: number;
	refresh_token: string;
}

export type GitlabTokens = {
	accessToken: string;
	accessTokenExpiresIn: number;
	refreshToken: string;
};

export type GitlabUser = {
	id: number;
	username: string;
	email: string;
	name: string;
	state: string;
	avatar_url: string;
	web_url: string;
	created_at: string;
	bio: string;
	public_email: string;
	skype: string;
	linkedin: string;
	twitter: string;
	discord: string;
	website_url: string;
	organization: string;
	job_title: string;
	pronouns: string;
	bot: boolean;
	work_information: string | null;
	followers: number;
	following: number;
	local_time: string;
	last_sign_in_at: string;
	confirmed_at: string;
	theme_id: number;
	last_activity_on: string;
	color_scheme_id: number;
	projects_limit: number;
	current_sign_in_at: string;
	identities: { provider: string; extern_uid: string }[];
	can_create_group: boolean;
	can_create_project: boolean;
	two_factor_enabled: boolean;
	external: boolean;
	private_profile: boolean;
	commit_email: string;
};
