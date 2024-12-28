import * as encoding from "@oslojs/encoding";
import * as sha2 from "@oslojs/crypto/sha2";

export class OAuth2Tokens {
	public data: object;

	constructor(data: object) {
		this.data = data;
	}

	public tokenType(): string {
		if ("token_type" in this.data && typeof this.data.token_type === "string") {
			return this.data.token_type;
		}
		throw new Error("Missing or invalid 'token_type' field");
	}

	public accessToken(): string {
		if ("access_token" in this.data && typeof this.data.access_token === "string") {
			return this.data.access_token;
		}
		throw new Error("Missing or invalid 'access_token' field");
	}

	public accessTokenExpiresInSeconds(): number {
		if ("expires_in" in this.data && typeof this.data.expires_in === "number") {
			return this.data.expires_in;
		}
		throw new Error("Missing or invalid 'expires_in' field");
	}

	public accessTokenExpiresAt(): Date {
		return new Date(Date.now() + this.accessTokenExpiresInSeconds() * 1000);
	}

	public hasRefreshToken(): boolean {
		return "refresh_token" in this.data && typeof this.data.refresh_token === "string";
	}

	public refreshToken(): string {
		if ("refresh_token" in this.data && typeof this.data.refresh_token === "string") {
			return this.data.refresh_token;
		}
		throw new Error("Missing or invalid 'refresh_token' field");
	}

	public hasScopes(): boolean {
		return "scope" in this.data && typeof this.data.scope === "string";
	}

	public scopes(): string[] {
		if ("scope" in this.data && typeof this.data.scope === "string") {
			return this.data.scope.split(" ");
		}
		throw new Error("Missing or invalid 'scope' field");
	}

	public idToken(): string {
		if ("id_token" in this.data && typeof this.data.id_token === "string") {
			return this.data.id_token;
		}
		throw new Error("Missing or invalid field 'id_token'");
	}
}

export function createS256CodeChallenge(codeVerifier: string): string {
	const codeChallengeBytes = sha2.sha256(new TextEncoder().encode(codeVerifier));
	return encoding.encodeBase64urlNoPadding(codeChallengeBytes);
}

export function generateCodeVerifier(): string {
	const randomValues = new Uint8Array(32);
	crypto.getRandomValues(randomValues);
	return encoding.encodeBase64urlNoPadding(randomValues);
}

export function generateState(): string {
	const randomValues = new Uint8Array(32);
	crypto.getRandomValues(randomValues);
	return encoding.encodeBase64urlNoPadding(randomValues);
}
