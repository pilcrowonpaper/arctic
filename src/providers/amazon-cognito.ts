/*
While HTTP basic auth is supported when used without PKCE,
only client secret is supported when PKCE is used.
*/
import { createS256CodeChallenge } from "../oauth2.js";
import { createOAuth2Request, sendTokenRequest, sendTokenRevocationRequest } from "../request.js";

import type { OAuth2Tokens } from "../oauth2.js";

type AmazonCognitoOptions = {
	userPool: string;
	clientId: string;
	clientSecret?: string;
	redirectURI: string;
}

type CreateAuthorizationURLOptions = {
	codeVerifier: string;
	identityProvider?: string;
	idpIdentifier?: string;
	lang?: string;
	loginHint?: string;
	nonce?: string;
	scopes: string[];
	state: string;
}

type RefreshAccessTokenOptions = {
	codeVerifier?: string;
	code: string;
	refreshToken: string;
	scopes?: string[];
}
export class AmazonCognito {
	private authorizationEndpoint: string;
	private tokenEndpoint: string;
	private tokenRevocationEndpoint: string;

	private clientId: string;
	private clientSecret?: string;
	private redirectURI: string;

	constructor(options: AmazonCognitoOptions) {
		this.authorizationEndpoint = options.userPool + "/oauth2/authorize";
		this.tokenEndpoint = options.userPool + "/oauth2/token";
		this.tokenRevocationEndpoint = options.userPool + "/oauth2/revoke";

		this.clientId = options.clientId;
		this.clientSecret = options.clientSecret;
		this.redirectURI = options.redirectURI;
	}

	public createAuthorizationURL(options: CreateAuthorizationURLOptions): URL {
		const url = new URL(this.authorizationEndpoint);
		url.searchParams.set("response_type", "code");
		url.searchParams.set("client_id", this.clientId);
		url.searchParams.set("redirect_uri", this.redirectURI);
		url.searchParams.set("state", options.state);
		const codeChallenge = createS256CodeChallenge(options.codeVerifier);
		url.searchParams.set("code_challenge_method", "S256");
		url.searchParams.set("code_challenge", codeChallenge);
		if (options.scopes.length > 0) {
			url.searchParams.set("scope", options.scopes.join(" "));
		}
		if (options.loginHint) {
			url.searchParams.set("login_hint", options.loginHint);
		}
		if (options.nonce) {
			url.searchParams.set("nonce", options.nonce);
		}
		if (options.lang) {
			url.searchParams.set("lang", options.lang);
		}
		if (options.identityProvider) {
			url.searchParams.set("identity_provider", options.identityProvider);
		}
		if (options.idpIdentifier) {
			url.searchParams.set("idp_identifier", options.idpIdentifier);
		}
		return url;
	}

	public async validateAuthorizationCode(
		code: string,
		codeVerifier: string
	): Promise<OAuth2Tokens> {
		const body = new URLSearchParams();
		body.set("grant_type", "authorization_code");
		body.set("code", code);
		body.set("redirect_uri", this.redirectURI);
		body.set("code_verifier", codeVerifier);
		body.set("client_id", this.clientId);
		if (this.clientSecret) {
			body.set("client_secret", this.clientSecret);
		}
		const request = createOAuth2Request(this.tokenEndpoint, body);
		const tokens = await sendTokenRequest(request);
		return tokens;
	}

	public async refreshAccessToken(options: RefreshAccessTokenOptions): Promise<OAuth2Tokens> {
		const body = new URLSearchParams();
		body.set("grant_type", "refresh_token");
		body.set("client_id", this.clientId);
		if (this.clientSecret) {
			body.set("client_secret", this.clientSecret);
		}
		if (options.scopes && options.scopes.length > 0) {
			body.set("scope", options.scopes.join(" "));
		}
		body.set("redirect_uri", this.redirectURI);
		body.set("refresh_token", options.refreshToken);
		if (options.code) {
			body.set("code", options.code);
		}
		if (options.codeVerifier) {
			body.set("code_verifier", options.codeVerifier);
		}
		const request = createOAuth2Request(this.tokenEndpoint, body);
		const tokens = await sendTokenRequest(request);
		return tokens;
	}

	public async revokeToken(token: string): Promise<void> {
		const body = new URLSearchParams();
		body.set("token", token);
		body.set("client_id", this.clientId);
		const request = createOAuth2Request(this.tokenRevocationEndpoint, body);
		await sendTokenRevocationRequest(request);
	}
}
