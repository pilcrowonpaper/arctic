import {
	AuthorizationCodeAuthorizationURL,
	AuthorizationCodeTokenRequestContext,
	RefreshRequestContext
} from "@oslojs/oauth2";
import { sendTokenRequest } from "../request.js";

import type { OAuth2Tokens } from "../oauth2.js";

const authorizationEndpoint = "https://access.line.me/oauth2/v2.1/authorize";
const tokenEndpoint = "https://api.line.me/oauth2/v2.1/token";

export class Line {
	private clientId: string;
	private clientSecret: string;
	private redirectURI: string;

	constructor(clientId: string, clientSecret: string, redirectURI: string) {
		this.clientId = clientId;
		this.clientSecret = clientSecret;
		this.redirectURI = redirectURI;
	}

	public createAuthorizationURL(
		state: string,
		codeVerifier: string
	): AuthorizationCodeAuthorizationURL {
		const url = new AuthorizationCodeAuthorizationURL(authorizationEndpoint, this.clientId);
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
		context.authenticateWithRequestBody(this.clientId, this.clientSecret);
		context.setRedirectURI(this.redirectURI);
		context.setCodeVerifier(codeVerifier);
		const tokens = await sendTokenRequest(tokenEndpoint, context);
		return tokens;
	}

	public async refreshAccessToken(refreshToken: string): Promise<OAuth2Tokens> {
		const context = new RefreshRequestContext(refreshToken);
		context.authenticateWithRequestBody(this.clientId, this.clientSecret);
		const tokens = await sendTokenRequest(tokenEndpoint, context);
		return tokens;
	}
}
