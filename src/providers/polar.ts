import { createS256CodeChallenge } from "../oauth2.js";
import { createOAuth2Request, sendTokenRequest, sendTokenRevocationRequest } from "../request.js";

import type { OAuth2Tokens } from "../oauth2.js";

const authorizationEndpoint = "https://polar.sh/oauth2/authorize";
const tokenEndpoint = "https://api.polar.sh/v1/oauth2/token";
const tokenRevocationEndpoint = "https://api.polar.sh/v1/oauth2/revoke";

export class Polar {
	private clientId: string;
	private clientSecret: string | null;
	private redirectURI: string;

	constructor(clientId: string, clientSecret: string | null, redirectURI: string) {
		this.clientId = clientId;
		this.clientSecret = clientSecret;
		this.redirectURI = redirectURI;
	}

	public createAuthorizationURL(state: string, codeVerifier: string, scopes: string[]): URL {
		const url = new URL(authorizationEndpoint);
		url.searchParams.set("client_id", this.clientId);
		url.searchParams.set("response_type", "code");
		url.searchParams.set("redirect_uri", this.redirectURI);
		url.searchParams.set("state", state);
		if (scopes.length > 0) {
			url.searchParams.set("scope", scopes.join(" "));
		}
		const codeChallenge = createS256CodeChallenge(codeVerifier);
		url.searchParams.set("code_challenge", codeChallenge);
		url.searchParams.set("code_challenge_method", "S256");
		return url;
	}

	public async validateAuthorizationCode(
		code: string,
		codeVerifier: string
	): Promise<OAuth2Tokens> {
		const body = new URLSearchParams();
		body.set("code", code);
		body.set("client_id", this.clientId);
		if (this.clientSecret !== null) {
			body.set("client_secret", this.clientSecret);
		}
		body.set("redirect_uri", this.redirectURI);
		body.set("grant_type", "authorization_code");
		body.set("code_verifier", codeVerifier);
		const request = createOAuth2Request(tokenEndpoint, body);
		const tokens = await sendTokenRequest(request);
		return tokens;
	}

	public async refreshAccessToken(refreshToken: string): Promise<OAuth2Tokens> {
		const body = new URLSearchParams();
		body.set("refresh_token", refreshToken);
		body.set("client_id", this.clientId);
		if (this.clientSecret !== null) {
			body.set("client_secret", this.clientSecret);
		}
		body.set("grant_type", "refresh_token");
		const request = createOAuth2Request(tokenEndpoint, body);
		const tokens = await sendTokenRequest(request);
		return tokens;
	}

	public async revokeToken(token: string): Promise<void> {
		const body = new URLSearchParams();
		body.set("token", token);
		const request = createOAuth2Request(tokenRevocationEndpoint, body);
		await sendTokenRevocationRequest(request);
	}
}
