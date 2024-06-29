import {
	AuthorizationCodeAuthorizationURL,
	AuthorizationCodeTokenRequestContext,
	RefreshRequestContext,
	TokenRevocationRequestContext
} from "@oslojs/oauth2";
import { sendTokenRequest, sendTokenRevocationRequest } from "../request.js";

import type { OAuth2Tokens } from "../oauth2.js";

export class Authentik {
	private authorizationEndpoint: string;
	private tokenEndpoint: string;
	private tokenRevocationEndpoint: string;

	private clientId: string;
	private clientSecret: string;
	private redirectURI: string;

	constructor(domain: string, clientId: string, clientSecret: string, redirectURI: string) {
		this.authorizationEndpoint = `https://${domain}/application/o/authorize/`;
		this.tokenEndpoint = `https://${domain}/application/o/token/`;
		this.tokenRevocationEndpoint = `https://${domain}/application/o/revoke`;
		this.clientId = clientId;
		this.clientSecret = clientSecret;
		this.redirectURI = redirectURI;
	}

	public createAuthorizationURL(
		state: string,
		codeVerifier: string
	): AuthorizationCodeAuthorizationURL {
		const url = new AuthorizationCodeAuthorizationURL(this.authorizationEndpoint, this.clientId);
		url.setRedirectURI(this.redirectURI);
		url.setState(state);
		url.setS256CodeChallenge(codeVerifier);
		return url;
	}

	public async validateAuthorizationCode(
		code: string,
		codeVerifier: string
	): Promise<OAuth2Tokens> {
		const context = new AuthorizationCodeTokenRequestContext(code);
		context.authenticateWithHTTPBasicAuth(this.clientId, this.clientSecret);
		context.setRedirectURI(this.redirectURI);
		context.setCodeVerifier(codeVerifier);
		const tokens = await sendTokenRequest(this.tokenEndpoint, context);
		return tokens;
	}

	public async refreshAccessToken(refreshToken: string): Promise<OAuth2Tokens> {
		const context = new RefreshRequestContext(refreshToken);
		context.authenticateWithHTTPBasicAuth(this.clientId, this.clientSecret);
		const tokens = await sendTokenRequest(this.tokenEndpoint, context);
		return tokens;
	}

	public async revokeToken(token: string): Promise<void> {
		const context = new TokenRevocationRequestContext(token);
		context.authenticateWithHTTPBasicAuth(this.clientId, this.clientSecret);
		await sendTokenRevocationRequest(this.tokenRevocationEndpoint, context);
	}
}