import { CodeChallengeMethod } from "../client.js";
import { createS256CodeChallenge, type OAuth2Tokens } from "../oauth2.js";
import { createOAuth2Request, sendTokenRequest } from "../request.js";

const authorizationEndpoint = "https://auth.mercadopago.com/authorization";
const tokenEndpoint = "https://api.mercadopago.com/oauth/token";

// MercadoPago doesn't seem to support HTTP Basic Auth
// It doesn't require "scopes" since they are defined in the application settings
export class MercadoPago {
	public clientId: string;

	private clientSecret: string;
	private redirectURI: string;

	constructor(clientId: string, clientSecret: string, redirectURI: string) {
		this.clientId = clientId;
		this.clientSecret = clientSecret;
		this.redirectURI = redirectURI;
	}

	public createAuthorizationURL(state: string): URL {
		const url = new URL(authorizationEndpoint);
		url.searchParams.set("response_type", "code");
		url.searchParams.set("client_id", this.clientId);
		url.searchParams.set("redirect_uri", this.redirectURI);
		url.searchParams.set("state", state);
		return url;
	}

	public createAuthorizationURLWithPKCE(
		state: string,
		codeChallengeMethod: CodeChallengeMethod,
		codeVerifier: string
	): URL {
		const url = this.createAuthorizationURL(state);
		if (codeChallengeMethod === CodeChallengeMethod.S256) {
			const codeChallenge = createS256CodeChallenge(codeVerifier);
			url.searchParams.set("code_challenge_method", "S256");
			url.searchParams.set("code_challenge", codeChallenge);
		} else if (codeChallengeMethod === CodeChallengeMethod.Plain) {
			url.searchParams.set("code_challenge_method", "plain");
			url.searchParams.set("code_challenge", codeVerifier);
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
		if (codeVerifier !== null) {
			body.set("code_verifier", codeVerifier);
		}
		body.set("client_id", this.clientId);
		body.set("client_secret", this.clientSecret);
		const request = createOAuth2Request(tokenEndpoint, body);
		const tokens = await sendTokenRequest(request);
		return tokens;
	}

	public async refreshAccessToken(refreshToken: string): Promise<OAuth2Tokens> {
		const body = new URLSearchParams();
		body.set("grant_type", "refresh_token");
		body.set("refresh_token", refreshToken);
		body.set("client_id", this.clientId);
		body.set("client_secret", this.clientSecret);
		const request = createOAuth2Request(tokenEndpoint, body);
		const tokens = await sendTokenRequest(request);
		return tokens;
	}
}
