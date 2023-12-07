import { OAuth2Client } from "oslo/oauth2";

import type { OAuth2Provider } from "../index.js";

const authorizeEndpoint = "https://github.com/login/oauth/authorize";
const tokenEndpoint = "https://github.com/login/oauth/access_token";

export class GitHub implements OAuth2Provider {
	private client: OAuth2Client;
	private scope: string[];
	private clientSecret: string;

	constructor(
		clientId: string,
		clientSecret: string,
		options?: {
			redirectURI?: string;
			scope?: string[];
		}
	) {
		this.client = new OAuth2Client(clientId, authorizeEndpoint, tokenEndpoint, {
			redirectURI: options?.redirectURI
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

	public async validateAuthorizationCode(code: string): Promise<GitHubTokens> {
		const result = await this.client.validateAuthorizationCode(code, {
			authenticateWith: "request_body",
			credentials: this.clientSecret
		});
		return {
			accessToken: result.access_token
		};
	}

	public async getUser(accessToken: string): Promise<GitHubUser> {
		const response = await fetch("https://api.github.com/user", {
			headers: {
				Authorization: ["Bearer", accessToken].join(" ")
			}
		});
		return await response.json();
	}
}

export interface GitHubTokens {
	accessToken: string;
}

export type GitHubUser = PublicGitHubUser | PrivateGitHubUser;

export interface PublicGitHubUser {
	avatar_url: string;
	bio: string | null;
	blog: string | null;
	company: string | null;
	created_at: string;
	email: string | null;
	events_url: string;
	followers: number;
	followers_url: string;
	following: number;
	following_url: string;
	gists_url: string;
	gravatar_id: string | null;
	hireable: boolean | null;
	html_url: string;
	id: number;
	location: string | null;
	login: string;
	name: string | null;
	node_id: string;
	organizations_url: string;
	public_gists: number;
	public_repos: number;
	received_events_url: string;
	repos_url: string;
	site_admin: boolean;
	starred_url: string;
	subscriptions_url: string;
	type: string;
	updated_at: string;
	url: string;

	twitter_username?: string | null;
	plan?: {
		name: string;
		space: number;
		private_repos: number;
		collaborators: number;
	};
	suspended_at?: string | null;
}

export interface PrivateGitHubUser extends PublicGitHubUser {
	collaborators: number;
	disk_usage: number;
	owned_private_repos: number;
	private_gists: number;
	total_private_repos: number;
	two_factor_authentication: boolean;

	business_plus?: boolean;
	ldap_dn?: string;
}
