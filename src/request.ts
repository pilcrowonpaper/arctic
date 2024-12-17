import { encodeBase64 } from "@oslojs/encoding";
import { OAuth2Tokens } from "./oauth2.js";

export function createOAuth2Request(endpoint: string, body: URLSearchParams): Request {
	const bodyBytes = new TextEncoder().encode(body.toString());
	const request = new Request(endpoint, {
		method: "POST",
		body: bodyBytes
	});
	request.headers.set("Content-Type", "application/x-www-form-urlencoded");
	request.headers.set("Accept", "application/json");
	// Required by GitHub, and probably by others as well
	request.headers.set("User-Agent", "arctic");
	// Required by Reddit
	request.headers.set("Content-Length", bodyBytes.byteLength.toString());
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
	if ("error" in data && typeof data.error === "string") {
		const error = createOAuth2RequestError(data);
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
	if (response.ok) {
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
	if ("error" in data && typeof data.error === "string") {
		const error = createOAuth2RequestError(data);
		throw error;
	}
}

function createOAuth2RequestError(result: object): OAuth2RequestError {
	let code: string;
	if ("error" in result && typeof result.error === "string") {
		code = result.error;
	} else {
		throw new Error("Invalid error response");
	}
	let description: string | null = null;
	let uri: string | null = null;
	let state: string | null = null;
	if ("error_description" in result && typeof result.error_description === "string") {
		description = result.error_description;
	}
	if ("error_uri" in result && typeof result.error_uri === "string") {
		uri = result.error_uri;
	}
	if ("state" in result && typeof result.state === "string") {
		state = result.state;
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
