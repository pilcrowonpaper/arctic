import { base64url } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { TokenRequestResult } from "@oslojs/oauth2";

export class OAuth2Tokens {
	public data: object;

	private result: TokenRequestResult;

	constructor(data: object) {
		this.data = data;
		this.result = new TokenRequestResult(data);
	}

	public tokenType(): string {
		return this.result.tokenType();
	}

	public accessToken(): string {
		return this.result.accessToken();
	}

	public accessTokenExpiresInSeconds(): number {
		return this.result.accessTokenExpiresInSeconds();
	}

	public accessTokenExpiresAt(): Date {
		return this.result.accessTokenExpiresAt();
	}

	public hasRefreshToken(): boolean {
		return this.result.hasRefreshToken();
	}

	public refreshToken(): string {
		return this.result.refreshToken();
	}

	public hasScopes(): boolean {
		return this.result.hasScopes();
	}

	public scopes(): string[] {
		return this.result.scopes();
	}

	public idToken(): string {
		if ("id_token" in this.data && typeof this.data.id_token === "string") {
			return this.data.id_token;
		}
		throw new Error("Missing or invalid field 'id_token'");
	}
}

export function createS256CodeChallenge(codeVerifier: string): string {
	const codeChallengeBytes = sha256(new TextEncoder().encode(codeVerifier));
	return base64url.encodeNoPadding(codeChallengeBytes);
}

export function generateCodeVerifier(): string {
	const randomValues = new Uint8Array(32);
	crypto.getRandomValues(randomValues);
	return base64url.encodeNoPadding(randomValues);
}

export function generateState(): string {
	const randomValues = new Uint8Array(32);
	crypto.getRandomValues(randomValues);
	return base64url.encodeNoPadding(randomValues);
}
