import { TimeSpan, createDate } from "oslo";
import { OAuth2Client } from "oslo/oauth2";

const authorizeEndpoint = "https://www.linkedin.com/oauth/v2/authorization";
const tokenEndpoint = "https://api.linkedin.com/v2/userinfo";

export class LinkedIn {
	private client: OAuth2Client;
	private scope: string[];
	private clientSecret: string;

	constructor(
		clientId: string,
		clientSecret: string,
		options?: {
			redirectURI?: string;
			scope?: string[];
		}
	) {
		this.client = new OAuth2Client(clientId, authorizeEndpoint, tokenEndpoint, {
			redirectURI: options?.redirectURI
		});
		this.scope = options?.scope ?? [];
		this.clientSecret = clientSecret;
	}
}
