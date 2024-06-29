import {
	AuthorizationCodeAuthorizationURL,
	AuthorizationCodeTokenRequestContext,
	RefreshRequestContext,
	TokenRevocationRequestContext
} from "@oslojs/oauth2";
import { sendTokenRequest, sendTokenRevocationRequest } from "../request.js";

import type { OAuth2Tokens } from "../oauth2.js";

export class Auth0 {
	private authorizationEndpoint: string;
	private tokenEndpoint: string;
	private tokenRevocationEndpoint: string;

	private clientId: string;
	private clientSecret: string;
	private redirectURI: string;

	constructor(domain: string, clientId: string, clientSecret: string, redirectURI: string) {
		this.authorizationEndpoint = `https://${domain}/authorize`;
		this.tokenEndpoint = `https://${domain}/oauth/token`;
		this.tokenRevocationEndpoint = `https://${domain}/oauth/revoke`;
		this.clientId = clientId;
		this.clientSecret = clientSecret;
		this.redirectURI = redirectURI;
	}

	public createAuthorizationURL(state: string): AuthorizationCodeAuthorizationURL {
		const url = new AuthorizationCodeAuthorizationURL(this.authorizationEndpoint, this.clientId);
		url.setRedirectURI(this.redirectURI);
		url.setState(state);
		return url;
	}

	public async validateAuthorizationCode(code: string): Promise<OAuth2Tokens> {
		const context = new AuthorizationCodeTokenRequestContext(code);
		context.authenticateWithHTTPBasicAuth(this.clientId, this.clientSecret);
		context.setRedirectURI(this.redirectURI);
		const tokens = await sendTokenRequest(this.tokenEndpoint, context);
		return tokens;
	}

	public async refreshAccessToken(refreshToken: string): Promise<OAuth2Tokens> {
		const context = new RefreshRequestContext(refreshToken);
		context.authenticateWithHTTPBasicAuth(this.clientId, this.clientSecret);
		const tokens = await sendTokenRequest(this.tokenEndpoint, context);
		return tokens;
	}

	public async revokeToken(refreshToken: string): Promise<void> {
		const context = new TokenRevocationRequestContext(refreshToken);
		context.authenticateWithHTTPBasicAuth(this.clientId, this.clientSecret);
		await sendTokenRevocationRequest(this.tokenRevocationEndpoint, context);
	}
}
