import {
	ArcticFetchError,
	createOAuth2Request,
	createOAuth2RequestError,
	UnexpectedErrorResponseBodyError,
	UnexpectedResponseError
} from "../request.js";
import { OAuth2Tokens } from "../oauth2.js";

const authorizationEndpoint = "https://account.withings.com/oauth2_user/authorize2";
const tokenEndpoint = "https://wbsapi.withings.net/v2/oauth2";

export class Withings {
	private clientId: string;
	private clientSecret: string;
	private redirectURI: string;

	constructor(clientId: string, clientSecret: string, redirectURI: string) {
		this.clientId = clientId;
		this.clientSecret = clientSecret;
		this.redirectURI = redirectURI;
	}

	public createAuthorizationURL(state: string, scopes: string[]): URL {
		const url = new URL(authorizationEndpoint);
		url.searchParams.set("response_type", "code");
		url.searchParams.set("client_id", this.clientId);
		url.searchParams.set("state", state);
		// Withings deviates from the RFC and uses a comma-delimitated string instead of spaces.
		if (scopes.length > 0) {
			url.searchParams.set("scope", scopes.join(","));
		}
		url.searchParams.set("redirect_uri", this.redirectURI);
		return url;
	}

	public async validateAuthorizationCode(code: string): Promise<OAuth2Tokens> {
		const body = new URLSearchParams();
		// Withings requires an `action` parameter.
		body.set("action", "requesttoken");
		body.set("grant_type", "authorization_code");
		body.set("code", code);
		body.set("redirect_uri", this.redirectURI);
		body.set("client_id", this.clientId);
		body.set("client_secret", this.clientSecret);
		const request = createOAuth2Request(tokenEndpoint, body);
		const tokens = await sendTokenRequest(request);
		return tokens;
	}
}

async function sendTokenRequest(request: Request): Promise<OAuth2Tokens> {
	let response: Response;
	try {
		response = await fetch(request);
	} catch (e) {
		throw new ArcticFetchError(e);
	}

	// Withings returns a 200 even for error responses.
	if (response.status !== 200) {
		if (response.body !== null) {
			await response.body.cancel();
		}
		throw new UnexpectedResponseError(response.status);
	}

	let data: unknown;
	try {
		data = await response.json();
	} catch {
		throw new UnexpectedResponseError(response.status);
	}
	if (typeof data !== "object" || data === null) {
		throw new UnexpectedErrorResponseBodyError(response.status, data);
	}

	// Withings returns an `error` field but the value deviates from the RFC.
	// Probably better to throw `UnexpectedErrorResponseBodyError`
	// but we're keeping `OAuth2RequestError` for now to be consistent with the other providers.
	if ("error" in data && typeof data.error === "string") {
		let error: Error;
		try {
			error = createOAuth2RequestError(data);
		} catch {
			throw new UnexpectedErrorResponseBodyError(response.status, data);
		}
		throw error;
	}

	// Withings returns `{"status": 0, "body": {...}}`.
	if (!("body" in data) || typeof data.body !== "object" || data.body === null) {
		throw new Error("Missing or invalid 'body' field");
	}
	const tokens = new OAuth2Tokens(data.body);
	return tokens;
}
