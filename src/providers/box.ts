import { OAuth2Client } from "oslo/oauth2";

import type { OAuth2Provider } from "../index.js";

const authorizeEndpoint = "https://account.box.com/api/oauth2/authorize";
const tokenEndpoint = "https://api.box.com/oauth2/token";
const userEndpoint = "https://api.box.com/2.0/users/me";

export class Box implements OAuth2Provider {
	private client: OAuth2Client;
	private clientSecret: string;

	constructor(clientId: string, clientSecret: string, redirectURI: string) {
		this.client = new OAuth2Client(clientId, authorizeEndpoint, tokenEndpoint, {
			redirectURI
		});
		this.clientSecret = clientSecret;
	}

	public async createAuthorizationURL(codeVerifier: string): Promise<URL> {
		return await this.client.createAuthorizationURL({
			codeVerifier
		});
	}

	public async validateAuthorizationCode(code: string): Promise<BoxTokens> {
		const result = await this.client.validateAuthorizationCode(code, {
			authenticateWith: "request_body",
			credentials: this.clientSecret
		});
		return {
			accessToken: result.access_token
		};
	}

	public async getUser(accessToken: string): Promise<BoxUser> {
		const response = await fetch(userEndpoint, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});
		return await response.json();
	}
}

export interface BoxTokens {
	accessToken: string;
}

export interface BoxUser {
	id: string;
	type: "user";
	address: string;
	avatar_url: string;
	can_see_managed_users: boolean;
	created_at: string;
	enterprise: {
		id: string;
		type: string;
		name: string;
	};
	external_app_user_id: string;
	hostname: string;
	is_exempt_from_device_limits: boolean;
	is_exempt_from_login_verification: boolean;
	is_external_collab_restricted: boolean;
	is_platform_access_only: boolean;
	is_sync_enabled: boolean;
	job_title: string;
	language: string;
	login: string;
	max_upload_size: number;
	modified_at: string;
	my_tags: [string];
	name: string;
	notification_email: {
		email: string;
		is_confirmed: boolean;
	};
	phone: string;
	role: string;
	space_amount: number;
	space_used: number;
	status: "active" | "inactive" | "cannot_delete_edit" | "cannot_delete_edit_upload";
	timezone: string;
	tracking_codes: {
		type: string;
		name: string;
		value: string;
	}[];
}
