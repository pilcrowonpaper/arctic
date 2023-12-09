import { OAuth2Client } from "oslo/oauth2";
import { TimeSpan, createDate } from "oslo";

import type { OAuth2ProviderWithPKCE } from "../index.js";

const authorizeEndpoint = "https://login.salesforce.com/services/oauth2/authorize";
const tokenEndpoint = "https://login.salesforce.com/services/oauth2/token";
const userinfoEndpoint = "https://login.salesforce.com/services/oauth2/userinfo";

export class Salesforce implements OAuth2ProviderWithPKCE {
	private client: OAuth2Client;
	private scope: string[];
	private clientSecret: string;

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
		this.scope = options?.scope ?? [];
		this.scope.push("openid", "id", "profile");
		this.clientSecret = clientSecret;
	}
}
