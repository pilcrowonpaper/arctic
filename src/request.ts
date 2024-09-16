import { encodeBase64 } from "@oslojs/encoding";
import { OAuth2Tokens } from "./oauth2.js";
import { OAuth2RequestResult } from "@oslojs/oauth2";

export function createOAuth2Request(endpoint: string, body: URLSearchParams): Request {
	const request = new Request(endpoint, {
		method: "POST",
		body
	});
	request.headers.set("Content-Type", "application/x-www-form-urlencoded");
	request.headers.set("Accept", "application/json");
	request.headers.set("User-Agent", "arctic");
	return request;
}

export function encodeBasicCredentials(username: string, password: string): string {
	const bytes = new TextEncoder().encode(`${username}:${password}`);
	return encodeBase64(bytes);
}

export async function sendTokenRequest(request: Request): Promise<OAuth2Tokens> {
	let response: Response;
	try {
		response = await fetch(request);
	} catch (e) {
		throw new ArcticFetchError(e);
	}
	let data: unknown;
	try {
		data = await response.json();
	} catch {
		throw new Error("Failed to parse response body");
	}
	if (typeof data !== "object" || data === null) {
		throw new Error("Unexpected response body data");
	}
	const result = new OAuth2RequestResult(data);
	if (result.hasErrorCode()) {
		const error = createOAuth2RequestError(result);
		throw error;
	}
	return new OAuth2Tokens(data);
}

export async function sendTokenRevocationRequest(request: Request): Promise<void> {
	let response: Response;
	try {
		response = await fetch(request);
	} catch (e) {
		throw new ArcticFetchError(e);
	}
	if (response.ok && response.body === null) {
		return;
	}
	let data: unknown;
	try {
		data = await response.json();
	} catch {
		throw new Error("Failed to parse response body");
	}
	if (typeof data !== "object" || data === null) {
		throw new Error("Unexpected response body data");
	}
	const result = new OAuth2RequestResult(data);
	if (result.hasErrorCode()) {
		const error = createOAuth2RequestError(result);
		throw error;
	}
}

function createOAuth2RequestError(result: OAuth2RequestResult): OAuth2RequestError {
	const code = result.errorCode();
	let description: string | null = null;
	let uri: string | null = null;
	let state: string | null = null;
	if (result.hasErrorDescription()) {
		description = result.errorDescription();
	}
	if (result.hasErrorURI()) {
		uri = result.errorURI();
	}
	if ("state" in result.body && typeof result.body.state === "string") {
		state = result.state();
	}
	return new OAuth2RequestError(code, description, uri, state);
}

export class ArcticFetchError extends Error {
	constructor(cause: unknown) {
		super("Failed to send request", {
			cause
		});
	}
}

export class OAuth2RequestError extends Error {
	public code: string;
	public description: string | null;
	public uri: string | null;
	public state: string | null;

	constructor(code: string, description: string | null, uri: string | null, state: string | null) {
		super(`OAuth request error: ${code}`);
		this.code = code;
		this.description = description;
		this.uri = uri;
		this.state = state;
	}
}
