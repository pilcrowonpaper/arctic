import {
	AuthorizationCodeAuthorizationURL,
	AuthorizationCodeTokenRequestContext
} from "@oslojs/oauth2";
import { sendTokenRequest } from "../request.js";

import type { OAuth2Tokens } from "../oauth2.js";

const appAuthorizationEndpoint = "https://slack.com/oauth/v2/authorize";
const appTokenEndpoint = "https://slack.com/api/oauth.v2.access";

export class SlackApp {
	private clientId: string;
	private clientSecret: string;
	private redirectURI: string | null;

	constructor(clientId: string, clientSecret: string, redirectURI: string | null) {
		this.clientId = clientId;
		this.clientSecret = clientSecret;
		this.redirectURI = redirectURI;
	}

	public createAuthorizationURL(state: string): AuthorizationCodeAuthorizationURL {
		const url = new AuthorizationCodeAuthorizationURL(appAuthorizationEndpoint, this.clientId);
		if (this.redirectURI !== null) {
			url.setRedirectURI(this.redirectURI);
		}
		url.setState(state);
		return url;
	}

	public async validateAuthorizationCode(code: string): Promise<OAuth2Tokens> {
		const context = new AuthorizationCodeTokenRequestContext(code);
		context.authenticateWithHTTPBasicAuth(this.clientId, this.clientSecret);
		if (this.redirectURI !== null) {
			context.setRedirectURI(this.redirectURI);
		}
		const tokens = await sendTokenRequest(appTokenEndpoint, context);
		return tokens;
	}
}

const openidAuthorizationEndpoint = "https://slack.com/openid/connect/authorize";
const openidTokenEndpoint = "https://slack.com/api/openid.connect.token";

export class SlackOpenID {
	private clientId: string;
	private clientSecret: string;
	private redirectURI: string | null;

	constructor(clientId: string, clientSecret: string, redirectURI: string | null) {
		this.clientId = clientId;
		this.clientSecret = clientSecret;
		this.redirectURI = redirectURI;
	}

	public createAuthorizationURL(state: string): AuthorizationCodeAuthorizationURL {
		const url = new AuthorizationCodeAuthorizationURL(openidAuthorizationEndpoint, this.clientId);
		if (this.redirectURI !== null) {
			url.setRedirectURI(this.redirectURI);
		}
		url.setState(state);
		return url;
	}

	public async validateAuthorizationCode(code: string): Promise<OAuth2Tokens> {
		const context = new AuthorizationCodeTokenRequestContext(code);
		context.authenticateWithHTTPBasicAuth(this.clientId, this.clientSecret);
		if (this.redirectURI !== null) {
			context.setRedirectURI(this.redirectURI);
		}
		const tokens = await sendTokenRequest(openidTokenEndpoint, context);
		return tokens;
	}
}
