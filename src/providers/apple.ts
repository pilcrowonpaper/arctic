import { TimeSpan, createDate } from "oslo";
import { decodeBase64 } from "oslo/encoding";
import { createJWT } from "oslo/jwt";
import { OAuth2Client } from "oslo/oauth2";

import type { OAuth2Provider } from "../index.js";

const authorizeEndpoint = "https://appleid.apple.com/auth/authorize";
const tokenEndpoint = "https://appleid.apple.com/auth/token";

export class Apple implements OAuth2Provider {
	private client: OAuth2Client;
	private credentials: AppleCredentials;

	constructor(credentials: AppleCredentials, redirectURI: string) {
		this.client = new OAuth2Client(credentials.clientId, authorizeEndpoint, tokenEndpoint, {
			redirectURI
		});
		this.credentials = credentials;
	}

	public async createAuthorizationURL(
		state: string,
		options?: {
			scopes?: string[];
		}
	): Promise<URL> {
		return await this.client.createAuthorizationURL({
			state,
			scopes: options?.scopes
		});
	}

	public async validateAuthorizationCode(code: string): Promise<AppleTokens> {
		const result = await this.client.validateAuthorizationCode<AuthorizationCodeResponseBody>(
			code,
			{
				authenticateWith: "request_body",
				credentials: await this.createClientSecret()
			}
		);
		const tokens: AppleTokens = {
			accessToken: result.access_token,
			refreshToken: result.refresh_token ?? null,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			idToken: result.id_token
		};
		return tokens;
	}

	public async refreshAccessToken(refreshToken: string): Promise<AppleRefreshedTokens> {
		const result = await this.client.refreshAccessToken<RefreshTokenResponseBody>(refreshToken, {
			authenticateWith: "request_body",
			credentials: await this.createClientSecret()
		});
		const tokens: AppleRefreshedTokens = {
			accessToken: result.access_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			idToken: result.id_token
		};
		return tokens;
	}

	private async createClientSecret(): Promise<string> {
		const audience = "https://appleid.apple.com";
		const payload = {};
		const jwt = await createJWT("ES256", parsePKCS8PEM(this.credentials.certificate), payload, {
			headers: {
				kid: this.credentials.keyId
			},
			issuer: this.credentials.teamId,
			includeIssuedTimestamp: true,
			expiresIn: new TimeSpan(5, "m"),
			audiences: [audience],
			subject: this.credentials.clientId
		});
		return jwt;
	}
}

interface AuthorizationCodeResponseBody {
	access_token: string;
	refresh_token?: string;
	expires_in: number;
	id_token: string;
}

interface RefreshTokenResponseBody {
	access_token: string;
	refresh_token?: string;
	expires_in: number;
	id_token: string;
}

export interface AppleTokens {
	accessToken: string;
	refreshToken: string | null;
	accessTokenExpiresAt: Date;
	idToken: string;
}

export interface AppleRefreshedTokens {
	accessToken: string;
	accessTokenExpiresAt: Date;
	idToken: string;
}

export interface AppleCredentials {
	clientId: string;
	teamId: string;
	keyId: string;
	certificate: string;
}

function parsePKCS8PEM(pkcs8: string): Uint8Array {
	return decodeBase64(
		pkcs8
			.replace(/-----BEGIN PRIVATE KEY-----/, "")
			.replace(/-----END PRIVATE KEY-----/, "")
			.trim()
	);
}
