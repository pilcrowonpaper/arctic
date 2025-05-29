import { encodeBasicCredentials, sendTokenRevocationRequest } from "./request.js";
import { createS256CodeChallenge } from "./oauth2.js";
import { createOAuth2Request, sendTokenRequest } from "./request.js";

import type { OAuth2Tokens } from "./oauth2.js";

export class OAuth2Client {
	public clientId: string;

	private clientPassword: string | null;
	private redirectURI: string | null;
	private clientSecret: string | null;

	constructor(clientId: string, clientPassword: string | null, redirectURI: string | null, clientSecret: string | null) {
		this.clientId = clientId;
		this.clientPassword = clientPassword;
		this.redirectURI = redirectURI;
		this.clientSecret = clientSecret;
	}

	public createAuthorizationURL(
		authorizationEndpoint: string,
		state: string,
		scopes: string[]
	): URL {
		const url = new URL(authorizationEndpoint);
		url.searchParams.set("response_type", "code");
		url.searchParams.set("client_id", this.clientId);
		if (this.redirectURI !== null) {
			url.searchParams.set("redirect_uri", this.redirectURI);
		}
		url.searchParams.set("state", state);
		if (scopes.length > 0) {
			url.searchParams.set("scope", scopes.join(" "));
		}
		return url;
	}

	public createAuthorizationURLWithPKCE(
		authorizationEndpoint: string,
		state: string,
		codeChallengeMethod: CodeChallengeMethod,
		codeVerifier: string,
		scopes: string[]
	): URL {
		const url = new URL(authorizationEndpoint);
		url.searchParams.set("response_type", "code");
		url.searchParams.set("client_id", this.clientId);
		if (this.redirectURI !== null) {
			url.searchParams.set("redirect_uri", this.redirectURI);
		}
		url.searchParams.set("state", state);
		if (codeChallengeMethod === CodeChallengeMethod.S256) {
			const codeChallenge = createS256CodeChallenge(codeVerifier);
			url.searchParams.set("code_challenge_method", "S256");
			url.searchParams.set("code_challenge", codeChallenge);
		} else if (codeChallengeMethod === CodeChallengeMethod.Plain) {
			url.searchParams.set("code_challenge_method", "plain");
			url.searchParams.set("code_challenge", codeVerifier);
		}
		if (scopes.length > 0) {
			url.searchParams.set("scope", scopes.join(" "));
		}
		return url;
	}

	public async validateAuthorizationCode(
		tokenEndpoint: string,
		code: string,
		codeVerifier: string | null
	): Promise<OAuth2Tokens> {
		const body = new URLSearchParams();
		body.set("grant_type", "authorization_code");
		body.set("code", code);
		if (this.redirectURI !== null) {
			body.set("redirect_uri", this.redirectURI);
		}
		if (codeVerifier !== null) {
			body.set("code_verifier", codeVerifier);
		}
		if (this.clientPassword === null) {
			body.set("client_id", this.clientId);
		}
		if (this.clientSecret !== null) {
			body.set("client_secret", this.clientSecret)
		}
		const request = createOAuth2Request(tokenEndpoint, body);
		if (this.clientPassword !== null) {
			const encodedCredentials = encodeBasicCredentials(this.clientId, this.clientPassword);
			request.headers.set("Authorization", `Basic ${encodedCredentials}`);
		}
		const tokens = await sendTokenRequest(request);
		return tokens;
	}

	public async refreshAccessToken(
		tokenEndpoint: string,
		refreshToken: string,
		scopes: string[]
	): Promise<OAuth2Tokens> {
		const body = new URLSearchParams();
		body.set("grant_type", "refresh_token");
		body.set("refresh_token", refreshToken);
		if (this.clientPassword === null) {
			body.set("client_id", this.clientId);
		}
		if (this.clientSecret !== null) {
			body.set("client_secret", this.clientSecret)
		}
		if (scopes.length > 0) {
			body.set("scope", scopes.join(" "));
		}
		const request = createOAuth2Request(tokenEndpoint, body);
		if (this.clientPassword !== null) {
			const encodedCredentials = encodeBasicCredentials(this.clientId, this.clientPassword);
			request.headers.set("Authorization", `Basic ${encodedCredentials}`);
		}
		const tokens = await sendTokenRequest(request);
		return tokens;
	}

	public async revokeToken(tokenRevocationEndpoint: string, token: string): Promise<void> {
		const body = new URLSearchParams();
		body.set("token", token);
		if (this.clientPassword === null) {
			body.set("client_id", this.clientId);
		}
		if (this.clientSecret !== null) {
			body.set("client_secret", this.clientSecret)
		}
		const request = createOAuth2Request(tokenRevocationEndpoint, body);
		if (this.clientPassword !== null) {
			const encodedCredentials = encodeBasicCredentials(this.clientId, this.clientPassword);
			request.headers.set("Authorization", `Basic ${encodedCredentials}`);
		}
		await sendTokenRevocationRequest(request);
	}
}

export enum CodeChallengeMethod {
	S256 = 0,
	Plain
}
