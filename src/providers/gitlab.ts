import {
	createOAuth2Request,
	encodeBasicCredentials,
	sendTokenRequest,
	sendTokenRevocationRequest
} from "../request.js";

import type { OAuth2Tokens } from "../oauth2.js";

export class GitLab {
	private authorizationEndpoint: string;
	private tokenEndpoint: string;
	private tokenRevocationEndpoint: string;

	private clientId: string;
	private clientSecret: string;
	private redirectURI: string;

	constructor(domain: string, clientId: string, clientSecret: string, redirectURI: string) {
		this.authorizationEndpoint = `https://${domain}/oauth/authorize`;
		this.tokenEndpoint = `https://${domain}/oauth/token`;
		this.tokenRevocationEndpoint = `https://${domain}/oauth/revoke`;
		this.clientId = clientId;
		this.clientSecret = clientSecret;
		this.redirectURI = redirectURI;
	}

	public createAuthorizationURL(state: string, scopes: string[]): URL {
		const url = new URL(this.authorizationEndpoint);
		url.searchParams.set("response_type", "code");
		url.searchParams.set("client_id", this.clientId);
		url.searchParams.set("state", state);
		url.searchParams.set("scope", scopes.join(" "));
		url.searchParams.set("redirect_uri", this.redirectURI);
		return url;
	}

	public async validateAuthorizationCode(code: string): Promise<OAuth2Tokens> {
		const body = new URLSearchParams();
		body.set("grant_type", "authorization_code");
		body.set("code", code);
		body.set("redirect_uri", this.redirectURI);
		const request = createOAuth2Request(this.tokenEndpoint, body);
		const encodedCredentials = encodeBasicCredentials(this.clientId, this.clientSecret);
		request.headers.set("Authorization", `Basic ${encodedCredentials}`);
		const tokens = await sendTokenRequest(request);
		return tokens;
	}

	public async refreshAccessToken(refreshToken: string): Promise<OAuth2Tokens> {
		const body = new URLSearchParams();
		body.set("grant_type", "refresh_token");
		body.set("refresh_token", refreshToken);
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
