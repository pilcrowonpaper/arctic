import { createOAuth2Request, sendTokenRequest } from "../request.js";

import { type OAuth2Tokens } from "../oauth2.js";

const authorizationEndpoint = "https://secure.soundcloud.com/authorize";
const tokenEndpoint = "https://secure.soundcloud.com/oauth/token";

export class SoundCloud {
	private clientId: string;
	private clientSecret: string;
	private redirectURI: string;

	public constructor(clientId: string, clientSecret: string, redirectURI: string) {
		this.clientId = clientId;
		this.clientSecret = clientSecret;
		this.redirectURI = redirectURI;
	}

	public createAuthorizationURL(state: string, challenge: string): URL {
		const url = new URL(authorizationEndpoint);
		url.searchParams.set("client_id", this.clientId);
		url.searchParams.set("redirect_uri", this.redirectURI);
		url.searchParams.set("response_type", "code");
		url.searchParams.set("code_challenge", challenge);
		url.searchParams.set("code_challenge_method", "S256");
		url.searchParams.set("state", state);
		return url;
	}

	public async validateAuthorizationCode(code: string, challenge: string): Promise<OAuth2Tokens> {
		const body = new URLSearchParams();
		body.set("grant_type", "authorization_code");
		body.set("client_id", this.clientId);
		body.set("client_secret", this.clientSecret);
		body.set("redirect_uri", this.redirectURI);
		body.set("code_verifier", challenge);
		body.set("code", code);
		const request = createOAuth2Request(tokenEndpoint, body);
		// const encodedCredentials = encodeBasicCredentials(this.clientId, this.clientSecret);
		// request.headers.set("Authorization", `Basic ${encodedCredentials}`);
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
		// const encodedCredentials = encodeBasicCredentials(this.clientId, this.clientSecret);
		// request.headers.set("Authorization", `Basic ${encodedCredentials}`);
		const tokens = await sendTokenRequest(request);
		return tokens;
	}
}
