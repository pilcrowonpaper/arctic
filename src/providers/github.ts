import {
	AuthorizationCodeAuthorizationURL,
	AuthorizationCodeTokenRequestContext,
	RefreshRequestContext
} from "@oslojs/oauth2";
import { sendTokenRequest } from "../request.js";

import type { OAuth2Tokens } from "../oauth2.js";

const authorizationEndpoint = "https://github.com/login/oauth/authorize";
const tokenEndpoint = "https://github.com/login/oauth/access_token";

export class GitHub {
	private clientId: string;
	private clientSecret: string;
	private redirectURI: string | null;

	constructor(clientId: string, clientSecret: string, redirectURI: string | null) {
		this.clientId = clientId;
		this.clientSecret = clientSecret;
		this.redirectURI = redirectURI;
	}

	public createAuthorizationURL(state: string): AuthorizationCodeAuthorizationURL {
		const url = new AuthorizationCodeAuthorizationURL(authorizationEndpoint, this.clientId);
		url.setState(state);
		if (this.redirectURI !== null) {
			url.setRedirectURI(this.redirectURI);
		}
		return url;
	}

	public async validateAuthorizationCode(code: string): Promise<OAuth2Tokens> {
		const context = new AuthorizationCodeTokenRequestContext(code);
		context.authenticateWithHTTPBasicAuth(this.clientId, this.clientSecret);
		if (this.redirectURI !== null) {
			context.setRedirectURI(this.redirectURI);
		}
		const tokens = await sendTokenRequest(tokenEndpoint, context);
		return tokens;
	}

	public async refreshAccessToken(refreshToken: string): Promise<OAuth2Tokens> {
		const context = new RefreshRequestContext(refreshToken);
		context.authenticateWithHTTPBasicAuth(this.clientId, this.clientSecret);
		const tokens = await sendTokenRequest(tokenEndpoint, context);
		return tokens;
	}
}
