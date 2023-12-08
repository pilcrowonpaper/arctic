import { OAuth2Client } from "oslo/oauth2";

import type { OAuth2Provider } from "../index.js";

export class GitLab implements OAuth2Provider {
	private client: OAuth2Client;
	private clientSecret: string;
	private scope: string[];
	private domain: string;

	constructor(
		clientId: string,
		clientSecret: string,
		redirectURI: string,
		options?: {
			domain?: string;
			scope?: string[];
		}
	) {
		this.domain = options?.domain ?? "https://gitlab.com";
		const authorizeEndpoint = this.domain + "/oauth/authorize";
		const tokenEndpoint = this.domain + "/oauth/token";
		this.client = new OAuth2Client(clientId, authorizeEndpoint, tokenEndpoint, {
			redirectURI
		});
		this.clientSecret = clientSecret;
		this.scope = options?.scope ?? [];
		this.scope.push("read_user");
	}

	public async createAuthorizationURL(state: string): Promise<URL> {
		return await this.client.createAuthorizationURL({
			scope: this.scope,
			state
		});
	}
	public async validateAuthorizationCode(code: string): Promise<GitLabTokens> {
		const result = await this.client.validateAuthorizationCode<TokenResponseBody>(code, {
			authenticateWith: "request_body",
			credentials: this.clientSecret
		});

		return {
			accessToken: result.access_token,
			accessTokenExpiresIn: result.expires_in,
			refreshToken: result.refresh_token
		};
	}

	public async getUser(accessToken: string): Promise<GitLabUser> {
		const response = await fetch(this.domain + "/api/v4/user", {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});
		return await response.json();
	}

	public async refreshAccessToken(refreshToken: string): Promise<GitLabTokens> {
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

export interface GitLabTokens {
	accessToken: string;
	accessTokenExpiresIn: number;
	refreshToken: string;
}

export interface GitLabUser {
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
}
