import { TimeSpan, createDate } from "oslo";
import { decodeBase64 } from "oslo/encoding";
import { createJWT, parseJWT } from "oslo/jwt";
import { OAuth2Controller } from "oslo/oauth2";

const authorizeEndpoint = "https://appleid.apple.com/auth/authorize";
const tokenEndpoint = "https://appleid.apple.com/auth/token";

export class Apple {
	private controller: OAuth2Controller;
	private scope: string[];
	private credentials: AppleCredentials;

	constructor(
		credentials: AppleCredentials,
		redirectURI: string,
		options?: {
			responseMode?: "query" | "form_post";
			scope?: string[];
		}
	) {
		this.controller = new OAuth2Controller(credentials.clientId, authorizeEndpoint, tokenEndpoint, {
			redirectURI,
			responseMode: options?.responseMode
		});
		this.credentials = credentials;
		this.scope = options?.scope ?? [];
	}

	public async createAuthorizationURL(state: string): Promise<URL> {
		return await this.controller.createAuthorizationURL({
			state,
			scope: this.scope
		});
	}

	public async validateAuthorizationCode(code: string): Promise<AppleTokens> {
		const result = await this.controller.validateAuthorizationCode<AuthorizationCodeResponseBody>(
			code,
			{
				authenticateWith: "request_body",
				credentials: await this.createClientSecret()
			}
		);
		return {
			accessToken: result.access_token,
			refreshToken: result.refresh_token ?? null,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			idToken: result.id_token,
			idTokenClaims: this.parseIdToken(result.id_token)
		};
	}

	public async refreshAccessToken(refreshToken: string): Promise<AppleRefreshedTokens> {
		const result = await this.controller.refreshAccessToken<RefreshTokenResponseBody>(
			refreshToken,
			{
				authenticateWith: "request_body",
				credentials: await this.createClientSecret()
			}
		);
		return {
			accessToken: result.access_token,
			accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, "s")),
			idToken: result.id_token,
			idTokenClaims: this.parseIdToken(result.id_token)
		};
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
			audience,
			subject: this.credentials.clientId
		});
		return jwt.value;
	}

	private parseIdToken(idToken: string): AppleIdTokenClaims {
		const parsedIdToken = parseJWT(idToken);
		if (!parsedIdToken) throw new Error();
		const payload = parsedIdToken.payload as IdTokenPayload;
		const appleUser: AppleIdTokenClaims = {
			sub: payload.sub,
			email: payload.email,
			email_verified: payload.email_verified
		};
		return appleUser;
	}
}

interface IdTokenPayload {
	sub: string;
	email?: string;
	email_verified?: boolean;
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

export interface AppleIdTokenClaims {
	email?: string;
	email_verified?: boolean;
	sub: string;
}

export interface AppleTokens {
	accessToken: string;
	refreshToken: string | null;
	accessTokenExpiresAt: Date;
	idToken: string;
	idTokenClaims: AppleIdTokenClaims;
}

export interface AppleRefreshedTokens {
	accessToken: string;
	accessTokenExpiresAt: Date;
	idToken: string;
	idTokenClaims: AppleIdTokenClaims;
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
