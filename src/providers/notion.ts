import {
	AuthorizationCodeAuthorizationURL,
	AuthorizationCodeTokenRequestContext
} from "@oslojs/oauth2";
import { sendTokenRequest } from "../request.js";

import type { OAuth2Tokens } from "../oauth2.js";

const authorizationEndpoint = "https://api.notion.com/v1/oauth/authorize";
const tokenEndpoint = "https://api.notion.com/v1/oauth/token";

export class Notion {
	private clientId: string;
	private clientSecret: string;
	private redirectURI: string;

	constructor(clientId: string, clientSecret: string, redirectURI: string) {
		this.clientId = clientId;
		this.clientSecret = clientSecret;
		this.redirectURI = redirectURI;
	}

	public createAuthorizationURL(state: string): AuthorizationCodeAuthorizationURL {
		const url = new AuthorizationCodeAuthorizationURL(authorizationEndpoint, this.clientId);
		url.setRedirectURI(this.redirectURI);
		url.setState(state);
		url.searchParams.set("owner", "user");
		return url;
	}

	public async validateAuthorizationCode(code: string): Promise<OAuth2Tokens> {
		const context = new AuthorizationCodeTokenRequestContext(code);
		context.authenticateWithHTTPBasicAuth(this.clientId, this.clientSecret);
		context.setRedirectURI(this.redirectURI);
		const tokens = await sendTokenRequest(tokenEndpoint, context);
		return tokens;
	}
}
