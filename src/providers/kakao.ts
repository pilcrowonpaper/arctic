import { TimeSpan, createDate } from "oslo";
import { OAuth2Client } from "oslo/oauth2";

import type { OAuth2Provider } from "../index.js";

const authorizeEndpoint = "https://kauth.kakao.com/oauth/authorize";
const tokenEndpoint = "https://kauth.kakao.com/oauth/token";

export class Kakao implements OAuth2Provider {
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

	public async validateAuthorizationCode(code: string): Promise<KakaoTokens> {
		const result = await this.client.validateAuthorizationCode<TokenResponseBody>(code, {
			authenticateWith: "request_body",
			credentials: this.clientSecret
		});
		return {
			accessToken: result.access_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			refreshToken: result.refresh_token,
			refreshTokenExpiresAt: createDate(new TimeSpan(result.refresh_token_expires_in, "s"))
		};
	}

	public async getUser(accessToken: string): Promise<KakaoUser> {
		const response = await fetch("https://kapi.kakao.com/v2/user/me", {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});
		return await response.json();
	}

	public async refreshAccessToken(refreshToken: string): Promise<KakaoTokens> {
		const result = await this.client.refreshAccessToken<TokenResponseBody>(refreshToken, {
			authenticateWith: "request_body",
			credentials: this.clientSecret
		});
		return {
			accessToken: result.access_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			refreshToken: result.refresh_token,
			refreshTokenExpiresAt: createDate(new TimeSpan(result.refresh_token_expires_in, "s"))
		};
	}
}

interface TokenResponseBody {
	access_token: string;
	expires_in: number;
	refresh_token: string;
	refresh_token_expires_in: number;
}

export interface KakaoTokens {
	accessToken: string;
	accessTokenExpiresAt: Date;
	refreshToken: string;
	refreshTokenExpiresAt: Date;
}

export interface KakaoUser {
	id: number;
	has_signed_up?: boolean;
	connected_at?: string;
	synced_at?: string;
	properties?: Record<string, string>;
	kakao_account?: KakaoAccount;
	for_partner?: KakaoPartner;
}

export interface KakaoAccount {
	profile_needs_agreement?: boolean;
	profile_nickname_needs_agreement?: boolean;
	profile_image_needs_agreement?: boolean;
	profile?: KakaoProfile;
	email_needs_agreement?: boolean;
	is_email_valid?: boolean;
	is_email_verified?: boolean;
	email?: string;
	name_needs_agreement?: boolean;
	name?: string;
	age_range_needs_agreement?: boolean;
	ag_range?:
		| "1~9"
		| "10~14"
		| "15~19"
		| "20~29"
		| "30~39"
		| "40~49"
		| "50~59"
		| "60~69"
		| "70~79"
		| "80~89"
		| "90~";
	birthyear_needs_agreement?: boolean;
	birthyear?: string; // "YYYY";
	birthday_needs_agreement?: boolean;
	birthday?: string; // "MMDD";
	birthday_type?: "SOLAR" | "LUNAR";
	gender_needs_agreement?: boolean;
	gender?: "female" | "male";
	phone_number_needs_agreement?: boolean;
	phone_number?: string;
	ci_needs_agreement?: boolean;
	ci?: string;
	ci_authenticated_at?: string;
}

export interface KakaoProfile {
	nickname?: string;
	thumbnail_image_url?: string;
	profile_image_url?: string;
	is_default_image?: boolean;
}

export interface KakaoPartner {
	uuid?: string;
}
