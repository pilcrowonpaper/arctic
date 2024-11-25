import { createS256CodeChallenge, type OAuth2Tokens } from "../oauth2.js";
import {
	createOAuth2Request,
	sendTokenRequest,
	sendTokenRevocationRequest,
} from "../request.js";

/**
 * Zitadel is a class that provides a simple interface to interact with the Zitadel OAuth2 API.
 * It's designed to be used in a server-side environment, such as a Node.js server with a configuration
 * of a client that has Authentication as None. This is the recommended configuration for
 * Zitadel web applications and backends.
 *
 * As a result, Unlike other oauth2 providers a client secret is not required.
 */
export class Zitadel {
	private authorizationEndpoint: string;
	private tokenEndpoint: string;
	private tokenRevocationEndpoint: string;

	constructor(
		domain: string,
		readonly clientId: string,
		readonly redirectURI: string,
	) {
		this.authorizationEndpoint = `${domain}/oauth/v2/authorize`;
		this.tokenEndpoint = `${domain}/oauth/v2/token`;
		this.tokenRevocationEndpoint = `${domain}/oauth/v2/revoke`;
	}

	public createAuthorizationURL(
		state: string,
		codeVerifier: string,
		scopes: string[],
	): URL {
		const url = new URL(this.authorizationEndpoint);
		url.searchParams.set("response_type", "code");
		url.searchParams.set("client_id", this.clientId);
		url.searchParams.set("state", state);
		url.searchParams.set("scope", scopes.join(" "));
		url.searchParams.set("redirect_uri", this.redirectURI);
		const codeChallenge = createS256CodeChallenge(codeVerifier);
		url.searchParams.set("code_challenge_method", "S256");
		url.searchParams.set("code_challenge", codeChallenge);
		return url;
	}

	public async validateAuthorizationCode(
		code: string,
		codeVerifier: string,
	): Promise<OAuth2Tokens> {
		const body = new URLSearchParams();
		body.set("grant_type", "authorization_code");
		body.set("code", code);
		body.set("code_verifier", codeVerifier);
		body.set("redirect_uri", this.redirectURI);
		body.set("client_id", this.clientId);
		const request = createOAuth2Request(this.tokenEndpoint, body);
		const tokens = await sendTokenRequest(request);
		return tokens;
	}

	public async refreshAccessToken(refreshToken: string): Promise<OAuth2Tokens> {
		const body = new URLSearchParams();
		body.set("grant_type", "refresh_token");
		body.set("refresh_token", refreshToken);
		const request = createOAuth2Request(this.tokenEndpoint, body);
		const tokens = await sendTokenRequest(request);
		return tokens;
	}

	public async revokeToken(token: string): Promise<void> {
		const body = new URLSearchParams();
		const endpoint = new URL(this.tokenRevocationEndpoint);
		endpoint.searchParams.set("token", token);
		endpoint.searchParams.set("client_id", this.clientId);
		const request = createOAuth2Request(endpoint.toString(), body);
		await sendTokenRevocationRequest(request);
	}
}
