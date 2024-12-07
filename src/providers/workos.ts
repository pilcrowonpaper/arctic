import { createOAuth2Request, sendTokenRequest } from "../request.js";

import { createS256CodeChallenge, type OAuth2Tokens } from "../oauth2.js";

const authorizationEndpoint = "https://api.workos.com/sso/authorize";
const tokenEndpoint = "https://api.workos.com/sso/token";

export class WorkOS {
	private clientId: string;
	private clientSecret: string | null;
	private redirectURI: string;

	constructor(clientId: string, clientSecret: string | null, redirectURI: string) {
		this.clientId = clientId;
		this.clientSecret = clientSecret;
		this.redirectURI = redirectURI;
	}

	public createAuthorizationURL(state: string, codeVerifier: string | null): URL {
		const url = new URL(authorizationEndpoint);
		url.searchParams.set("response_type", "code");
		url.searchParams.set("client_id", this.clientId);
		url.searchParams.set("state", state);
		url.searchParams.set("redirect_uri", this.redirectURI);
		if (codeVerifier !== null) {
			const codeChallenge = createS256CodeChallenge(codeVerifier);
			url.searchParams.set("code_challenge_method", "S256");
			url.searchParams.set("code_challenge", codeChallenge);
		}
		return url;
	}

	public async validateAuthorizationCode(
		code: string,
		codeVerifier: string | null
	): Promise<OAuth2Tokens> {
		const body = new URLSearchParams();
		body.set("grant_type", "authorization_code");
		body.set("code", code);
		body.set("redirect_uri", this.redirectURI);
		body.set("client_id", this.clientId);
		if (this.clientSecret !== null) {
			body.set("client_secret", this.clientSecret);
		}
		if (codeVerifier !== null) {
			body.set("code_verifier", codeVerifier);
		}
		const request = createOAuth2Request(tokenEndpoint, body);
		const tokens = await sendTokenRequest(request);
		return tokens;
	}
}
