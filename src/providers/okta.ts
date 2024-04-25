import { OAuth2Client } from "oslo/oauth2";
import { TimeSpan, createDate } from "oslo";

import type { OAuth2ProviderWithPKCE } from "../index.js";

export class Okta implements OAuth2ProviderWithPKCE {
	private client: OAuth2Client;
	private clientSecret: string;

	constructor(
		oktaDomain: string,
		clientId: string,
		clientSecret: string,
		redirectURI: string,
		options?: {
			authorizationServerId?: string;
		}
	) {
		let authorizeEndpoint;
		let tokenEndpoint;

		if (options?.authorizationServerId) {
			authorizeEndpoint = `${oktaDomain}/oauth2/${options.authorizationServerId}/v1/authorize`;
			tokenEndpoint = `${oktaDomain}/oauth2/${options.authorizationServerId}/v1/token`;
		} else {
			authorizeEndpoint = `${oktaDomain}/oauth2/v1/authorize`;
			tokenEndpoint = `${oktaDomain}/oauth2/v1/token`;
		}

		this.client = new OAuth2Client(clientId, authorizeEndpoint, tokenEndpoint, {
			redirectURI
		});
		this.clientSecret = clientSecret;
	}

	public async createAuthorizationURL(
		state: string,
		codeVerifier: string,
		options?: {
			scopes?: string[];
		}
	): Promise<URL> {
		const url = await this.client.createAuthorizationURL({
			codeVerifier,
			scopes: [...(options?.scopes ?? []), "openid"]
		});
		url.searchParams.set("state", state);

		return url;
	}

	public async validateAuthorizationCode(code: string, codeVerifier: string): Promise<OktaTokens> {
		const result = await this.client.validateAuthorizationCode<TokenResponseBody>(code, {
			codeVerifier,
			credentials: this.clientSecret
		});

		const tokens: OktaTokens = {
			accessToken: result.access_token,
			refreshToken: result.refresh_token ?? null,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			idToken: result.id_token,
			deviceSecret: result.device_secret ?? null
		};

		return tokens;
	}

	public async refreshAccessToken(
		refreshToken: string,
		options?: {
			scopes?: string[];
		}
	): Promise<OktaTokens> {
		const result = await this.client.refreshAccessToken<TokenResponseBody>(refreshToken, {
			credentials: this.clientSecret,
			scopes: options?.scopes ?? []
		});

		const tokens: OktaTokens = {
			accessToken: result.access_token,
			refreshToken: result.refresh_token ?? null,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			idToken: result.id_token,
			deviceSecret: result.device_secret ?? null
		};

		return tokens;
	}
}

interface TokenResponseBody {
	access_token: string;
	token_type: string;
	expires_in: number;
	scope: string;
	refresh_token?: string;
	id_token: string;
	device_secret?: string;
}

export interface OktaTokens {
	idToken: string;
	accessToken: string;
	accessTokenExpiresAt: Date;
	refreshToken: string | null;
	deviceSecret: string | null;
}
