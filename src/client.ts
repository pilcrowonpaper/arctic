import { encodeBasicCredentials, sendTokenRevocationRequest } from "./request.js";
import { createS256CodeChallenge } from "./oauth2.js";
import { createOAuth2Request, sendTokenRequest } from "./request.js";

import type { OAuth2Tokens } from "./oauth2.js";

export class OAuth2Client {
	public clientId: string;
	public clientSecret: string | null;
	public redirectURI: string | null;

	constructor(clientId: string, clientSecret: string | null, redirectURI: string | null) {
		this.clientId = clientId;
		this.clientSecret = clientSecret;
		this.redirectURI = redirectURI;
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
		/*
        RFC 6749:
        > Parameters sent without a value MUST be treated as if they were omitted from the request.
        */
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
		/*
        RFC 6749:
        > Parameters sent without a value MUST be treated as if they were omitted from the request.
        */
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
		if (this.clientSecret === null) {
			body.set("client_id", this.clientId);
		}
		const request = createOAuth2Request(tokenEndpoint, body);
		if (this.clientSecret !== null) {
			const encodedCredentials = encodeBasicCredentials(this.clientId, this.clientSecret);
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
		if (this.clientSecret === null) {
			body.set("client_id", this.clientId);
		}
		if (scopes.length > 0) {
			body.set("scope", scopes.join(" "));
		}
		const request = createOAuth2Request(tokenEndpoint, body);
		if (this.clientSecret !== null) {
			const encodedCredentials = encodeBasicCredentials(this.clientId, this.clientSecret);
			request.headers.set("Authorization", `Basic ${encodedCredentials}`);
		}
		const tokens = await sendTokenRequest(request);
		return tokens;
	}

	public async revokeToken(tokenRevocationEndpoint: string, token: string): Promise<void> {
		const body = new URLSearchParams();
		body.set("token", token);
		if (this.clientSecret === null) {
			body.set("client_id", this.clientId);
		}
		const request = createOAuth2Request(tokenRevocationEndpoint, body);
		if (this.clientSecret !== null) {
			const encodedCredentials = encodeBasicCredentials(this.clientId, this.clientSecret);
			request.headers.set("Authorization", `Basic ${encodedCredentials}`);
		}
		await sendTokenRevocationRequest(request);
	}
}

export enum CodeChallengeMethod {
	S256 = 0,
	Plain
}
