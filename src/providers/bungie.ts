import { OAuth2Client } from "oslo/oauth2";
import { TimeSpan, createDate } from "oslo";

import type {OAuth2Provider} from "../index.js";

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
		return await this.client.createAuthorizationURL({
			state
		})
	}

	public async validateAuthorizationCode(code: string): Promise<BungieTokens> {
		const result = await this.client.validateAuthorizationCode<BungieTokenResponse>(code, {
			authenticateWith: "http_basic_auth",
			credentials: this.clientSecret
		});
		const tokens: BungieTokens = {
			accessToken: result.access_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			membershipId: result.membership_id
		};
		if ('refresh_token' in result) {
			(tokens as BungieTokensConfidential).refreshToken = result.refresh_token;
			(tokens as BungieTokensConfidential).refreshTokenExpiresAt = createDate(new TimeSpan(result.refresh_expires_in, "s"));
		}
		return tokens;
	}

	public async refreshAccessToken(refreshToken: string): Promise<BungieTokensConfidential> {
		const result = await this.client.refreshAccessToken<BungieTokenResponseConfidential>(refreshToken, {
			authenticateWith: "http_basic_auth",
			credentials: this.clientSecret
		});

		const tokens: BungieTokensConfidential = {
			accessToken: result.access_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			membershipId: result.membership_id,
			refreshToken: result.refresh_token,
			refreshTokenExpiresAt: createDate(new TimeSpan(result.refresh_expires_in, "s"))
		};

		return tokens;
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

type BungieTokenResponse = BungieTokenResponsePublic | BungieTokenResponseConfidential;
