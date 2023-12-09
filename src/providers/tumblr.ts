import { OAuth2Client } from "oslo/oauth2";

import type { OAuth2Provider } from "../index.js";

const authorizeEndpoint = "https://www.tumblr.com/oauth2/authorize";
const tokenEndpoint = "https://api.tumblr.com/v2/oauth2/token";
const userinfoEndpoint = "https://api.tumblr.com/v2/user/info";

export class Tumblr implements OAuth2Provider {
	private client: OAuth2Client;
	private clientSecret: string;
	private scope: string[];

	constructor(
		clientId: string,
		clientSecret: string,
		redirectURI: string,
		options?: {
			scope?: string[];
		}
	) {
		this.client = new OAuth2Client(clientId, authorizeEndpoint, tokenEndpoint, {
			redirectURI
		});
		this.clientSecret = clientSecret;
		this.scope = options?.scope ?? [];
		this.scope.push("basic");
	}

	
}
