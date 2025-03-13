import { createS256CodeChallenge } from "../oauth2.js";
import {
	createOAuth2Request,
	encodeBasicCredentials,
	joinURIAndPath,
	sendTokenRequest,
	sendTokenRevocationRequest
} from "../request.js";

import type { OAuth2Tokens } from "../oauth2.js";

export class Autodesk {
	private clientId: string;
	private clientSecret: string | null;
	private redirectURI: string;
	private baseUrl = "https://developer.api.autodesk.com/authentication/v2"
	private authorizationEndpoint: string;
	private tokenEndpoint: string;
	private tokenRevocationEndpoint: string;

    constructor(clientId: string, clientSecret: string | null, redirectURI: string) {
		this.authorizationEndpoint = joinURIAndPath(this.baseUrl, "/authorize")
		this.tokenEndpoint = joinURIAndPath(this.baseUrl, "/token")
		this.tokenRevocationEndpoint = joinURIAndPath(this.baseUrl, "/revoke")
		this.clientId = clientId;
		this.clientSecret = clientSecret;
		this.redirectURI = redirectURI;
    }

    public createAuthorizationURL(state: string, codeVerifier: string, scopes: string[]) {
		const url = new URL(this.authorizationEndpoint);
		url.searchParams.set("client_id", this.clientId);
		url.searchParams.set("response_type", "code");
		url.searchParams.set("redirect_uri", this.redirectURI);
		if (scopes.length > 0) {
			url.searchParams.set("scope", scopes.join(" "));
		}
		url.searchParams.set("state", state);
		url.searchParams.set("response_mode", "query");
		const codeChallenge = createS256CodeChallenge(codeVerifier);
		url.searchParams.set("code_challenge_method", "S256");
		url.searchParams.set("code_challenge", codeChallenge);
		return url;
    }

    public async validateAuthorizationCode(code: string, codeVerifier?: string): Promise<OAuth2Tokens> {
		const body = new URLSearchParams();
		if (this.clientSecret === null) {
			body.set("client_id", this.clientId);
		}
		body.set("grant_type", "authorization_code");
		body.set("code", code);
		body.set("redirect_uri", this.redirectURI);
        if (codeVerifier) {
            body.set("code_verifier", codeVerifier);
        }
		const request = createOAuth2Request(this.tokenEndpoint, body);
        request.headers.set("Content-Type", "application/x-www-form-urlencoded")
		if (this.clientSecret !== null) {
			const encodedCredentials = encodeBasicCredentials(this.clientId, this.clientSecret);
			request.headers.set("Authorization", `Basic ${encodedCredentials}`);
		}
		const tokens = await sendTokenRequest(request);
		return tokens;
	}

	public async refreshAccessToken(refreshToken: string, scopes: string[]): Promise<OAuth2Tokens> {
		const body = new URLSearchParams();
		body.set("grant_type", "refresh_token");
		body.set("refresh_token", refreshToken);
		if (this.clientSecret === null) {
			body.set("client_id", this.clientId);
		}
		if (scopes.length > 0) {
			body.set("scope", scopes.join(" "));
		}
		const request = createOAuth2Request(this.tokenEndpoint, body);
		request.headers.set("Content-Type", "application/x-www-form-urlencoded")
		if (this.clientSecret !== null) {
			const encodedCredentials = encodeBasicCredentials(this.clientId, this.clientSecret);
			request.headers.set("Authorization", `Basic ${encodedCredentials}`);
		}
		const tokens = await sendTokenRequest(request);
		return tokens;
	}
	
	public async revokeToken(token: string, token_type: "access_token" | "refresh_token"): Promise<void> {
		const body = new URLSearchParams();
		body.set("token", token);
		body.set("token_type_hint", token_type)
		if (this.clientSecret === null) {
			body.set("client_id", this.clientId);
		}
		const request = createOAuth2Request(this.tokenRevocationEndpoint, body);
		request.headers.set("Content-Type", "application/x-www-form-urlencoded")
		if (this.clientSecret !== null) {
			const encodedCredentials = encodeBasicCredentials(this.clientId, this.clientSecret);
			request.headers.set("Authorization", `Basic ${encodedCredentials}`);
		}
		await sendTokenRevocationRequest(request);
	}
}