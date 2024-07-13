import { createS256CodeChallenge } from "../oauth2.js";
import {
	createOAuth2Request,
	encodeBasicCredentials,
	sendTokenRequest,
	sendTokenRevocationRequest
} from "../request.js";

import type { OAuth2Tokens } from "../oauth2.js";

export class Okta {
	private authorizationEndpoint: string;
	private tokenEndpoint: string;
	private tokenRevocationEndpoint: string;

	private clientId: string;
	private clientSecret: string;
	private redirectURI: string;

	constructor(
		domain: string,
		authorizationServerId: string | null,
		clientId: string,
		clientSecret: string,
		redirectURI: string
	) {
		let baseURL = `https://${domain}/oauth2`;
		if (authorizationServerId !== null) {
			baseURL = baseURL + `/${authorizationServerId}`;
		}
		this.authorizationEndpoint = baseURL + "/v1/authorize";
		this.tokenEndpoint = baseURL + "/v1/token";
		this.tokenRevocationEndpoint = baseURL + "/v1/revoke";
		this.clientId = clientId;
		this.clientSecret = clientSecret;
		this.redirectURI = redirectURI;
	}

	public createAuthorizationURL(state: string, codeVerifier: string, scopes: string[]): URL {
		const url = new URL(this.authorizationEndpoint);
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
		codeVerifier: string
	): Promise<OAuth2Tokens> {
		const body = new URLSearchParams();
		body.set("grant_type", "authorization_code");
		body.set("code", code);
		body.set("code_verifier", codeVerifier);
		body.set("redirect_uri", this.redirectURI);
		const request = createOAuth2Request(this.tokenEndpoint, body);
		const encodedCredentials = encodeBasicCredentials(this.clientId, this.clientSecret);
		request.headers.set("Authorization", `Basic ${encodedCredentials}`);
		const tokens = await sendTokenRequest(request);
		return tokens;
	}

	public async refreshAccessToken(refreshToken: string, scopes: string[]): Promise<OAuth2Tokens> {
		const body = new URLSearchParams();
		body.set("grant_type", "refresh_token");
		body.set("refresh_token", refreshToken);
		body.set("scope", scopes.join(" "));
		const request = createOAuth2Request(this.tokenEndpoint, body);
		const encodedCredentials = encodeBasicCredentials(this.clientId, this.clientSecret);
		request.headers.set("Authorization", `Basic ${encodedCredentials}`);
		const tokens = await sendTokenRequest(request);
		return tokens;
	}

	public async revokeToken(token: string): Promise<void> {
		const body = new URLSearchParams();
		body.set("token", token);
		const request = createOAuth2Request(this.tokenRevocationEndpoint, body);
		const encodedCredentials = encodeBasicCredentials(this.clientId, this.clientSecret);
		request.headers.set("Authorization", `Basic ${encodedCredentials}`);
		await sendTokenRevocationRequest(request);
	}
}
