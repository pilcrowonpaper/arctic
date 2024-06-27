import { TokenRequestResult } from "@oslojs/oauth2";

export class OAuth2Tokens {
	public data: object;
	private parser: TokenRequestResult;

	constructor(data: object) {
		this.data = data;
		this.parser = new TokenRequestResult(data);
	}

	public accessToken(): string {
		return this.parser.accessToken();
	}

	public accessTokenExpiresInSeconds(): number {
		return this.parser.accessTokenExpiresInSeconds();
	}

	public accessTokenExpiresAt(): Date {
		return this.parser.accessTokenExpiresAt();
	}

	public hasRefreshToken(): boolean {
		return this.parser.hasRefreshToken();
	}

	public refreshToken(): string {
		return this.parser.refreshToken();
	}

	public refreshTokenExpiresInSeconds(): number {
		return this.parser.refreshTokenExpiresInSeconds();
	}

	public refreshTokenExpiresAt(): Date {
		return this.parser.refreshTokenExpiresAt();
	}

	public idToken(): string {
		if ("id_token" in this.data && typeof this.data.id_token === "string") {
			return this.data.id_token;
		}
		throw new Error("Missing or invalid field 'id_token'");
	}
}
