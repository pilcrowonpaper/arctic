import { OAuth2Client } from "oslo/oauth2";
import { TimeSpan, createDate } from "oslo";

import type { OAuth2Provider } from "../index.js";

const authorizeEndpoint = "https://www.bungie.net/en/oauth/authorize";
const tokenEndpoint = "https://www.bungie.net/platform/app/oauth/token/";

export class Bungie implements OAuth2Provider {
	private client: OAuth2Client;
	private readonly clientSecret?: string;

	constructor(clientId: string, redirectURI: string, clientSecret?: string) {
		this.client = new OAuth2Client(clientId, authorizeEndpoint, tokenEndpoint, {
			redirectURI
		});
		this.clientSecret = clientSecret;
	}

	public async createAuthorizationURL(
		state: string,
	): Promise<URL> {
		const url = new URL(authorizeEndpoint);
		url.searchParams.append("response_type", "code");
		url.searchParams.append("client_id", this.client.clientId);
		url.searchParams.append("state", state);
		return url;
	}

	public async validateAuthorizationCode(code: string): Promise<BungieTokens> {
		const response = await fetch(tokenEndpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				...(this.clientSecret && {
					"Authorization": `Basic ${this.encodeClientCredentials()}`
				})
			},
			body: new URLSearchParams({
				grant_type: "authorization_code",
				code,
			})
		});

		const result: BungieTokenResponse | BungieErrorResponse = await response.json();

		if ("error" in result) {
			throw new Error(result.error_description);
		}

		if ('refresh_token' in result) {
			return {
				accessToken: result.access_token,
				refreshToken: result.refresh_token,
				accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
				refreshTokenExpiresAt: result.refresh_expires_in ? createDate(new TimeSpan(result.refresh_expires_in, "s")) : undefined,
				membershipId: result.membership_id
			} as BungieTokensConfidential;
		}

		return {
			accessToken: result.access_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			membershipId: result.membership_id
		} as BungieTokensPublic;
	}

	public async refreshAccessToken(refreshToken: string): Promise<BungieTokensConfidential> {
		if (!this.clientSecret) {
			throw new Error("Cannot refresh access token for public client");
		}

		const response = await fetch(tokenEndpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				"Authorization": `Basic ${this.encodeClientCredentials()}`
			},
			body: `grant_type=refresh_token&refresh_token=${refreshToken}`
		});
		const result: BungieTokenResponseConfidential | BungieErrorResponse = await response.json();

		if ("error" in result) {
			throw new Error(result.error_description);
		}

		return {
			accessToken: result.access_token,
			refreshToken: result.refresh_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			refreshTokenExpiresAt: createDate(new TimeSpan(result.refresh_expires_in, "s")),
			membershipId: result.membership_id
		};
	}

	private encodeClientCredentials(): string {
		if (!this.clientSecret) {
			throw new Error("Client secret is required for confidential client");
		}
		return Buffer.from(`${this.client.clientId}:${this.clientSecret}`).toString('base64');
	}
}

export interface BungieTokensPublic {
	accessToken: string;
	accessTokenExpiresAt: Date;
	membershipId: string;
}

export interface BungieTokensConfidential extends BungieTokensPublic {
	refreshToken: string;
	refreshTokenExpiresAt: Date;
}

export type BungieTokens = BungieTokensConfidential | BungieTokensPublic;

interface BungieTokenResponsePublic {
	access_token: string;
	expires_in: number;
	membership_id: string;
}

interface BungieTokenResponseConfidential extends BungieTokenResponsePublic {
	refresh_token: string;
	refresh_expires_in: number;
}

interface BungieErrorResponse {
	error: string;
	error_description: string;
}

type BungieTokenResponse = BungieTokenResponsePublic | BungieTokenResponseConfidential;
