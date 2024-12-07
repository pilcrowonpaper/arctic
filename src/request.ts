import { encodeBase64 } from "@oslojs/encoding";
import { OAuth2Tokens } from "./oauth2.js";
import { trimLeft, trimRight } from "./utils.js";

export function joinURIAndPath(base: string, ...path: string[]): string {
	let joined = trimRight(base, "/");
	for (const part of path) {
		joined += "/";
		joined += trimRight(trimLeft(part, "/"), "/");
	}
	return joined;
}

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

	if (response.status === 400 || response.status === 401) {
		let data: unknown;
		try {
			data = await response.json();
		} catch {
			throw new UnexpectedResponseError(response.status);
		}
		if (typeof data !== "object" || data === null) {
			throw new UnexpectedErrorResponseBodyError(response.status, data);
		}
		let error: Error;
		try {
			error = createOAuth2RequestError(data);
		} catch {
			throw new UnexpectedErrorResponseBodyError(response.status, data);
		}
		throw error;
	}

	if (response.status === 200) {
		let data: unknown;
		try {
			data = await response.json();
		} catch {
			throw new UnexpectedResponseError(response.status);
		}
		if (typeof data !== "object" || data === null) {
			throw new UnexpectedErrorResponseBodyError(response.status, data);
		}
		const tokens = new OAuth2Tokens(data);
		return tokens;
	}

	if (response.body !== null) {
		await response.body.cancel();
	}
	throw new UnexpectedResponseError(response.status);
}

export async function sendTokenRevocationRequest(request: Request): Promise<void> {
	let response: Response;
	try {
		response = await fetch(request);
	} catch (e) {
		throw new ArcticFetchError(e);
	}

	if (response.status === 400 || response.status === 401) {
		let data: unknown;
		try {
			data = await response.json();
		} catch {
			throw new UnexpectedErrorResponseBodyError(response.status, null);
		}
		if (typeof data !== "object" || data === null) {
			throw new UnexpectedErrorResponseBodyError(response.status, data);
		}
		let error: Error;
		try {
			error = createOAuth2RequestError(data);
		} catch {
			throw new UnexpectedErrorResponseBodyError(response.status, data);
		}
		throw error;
	}

	if (response.status === 200) {
		if (response.body !== null) {
			await response.body.cancel();
		}
		return;
	}

	if (response.body !== null) {
		await response.body.cancel();
	}
	throw new UnexpectedResponseError(response.status);
}

export function createOAuth2RequestError(result: object): OAuth2RequestError {
	let code: string;
	if ("error" in result && typeof result.error === "string") {
		code = result.error;
	} else {
		throw new Error("Invalid error response");
	}
	let description: string | null = null;
	let uri: string | null = null;
	let state: string | null = null;
	if ("error_description" in result) {
		if (typeof result.error_description !== "string") {
			throw new Error("Invalid data");
		}
		description = result.error_description;
	}
	if ("error_uri" in result) {
		if (typeof result.error_uri !== "string") {
			throw new Error("Invalid data");
		}
		uri = result.error_uri;
	}
	if ("state" in result) {
		if (typeof result.state !== "string") {
			throw new Error("Invalid data");
		}
		state = result.state;
	}
	const error = new OAuth2RequestError(code, description, uri, state);
	return error;
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

export class UnexpectedResponseError extends Error {
	public status: number;

	constructor(responseStatus: number) {
		super("Unexpected error response");
		this.status = responseStatus;
	}
}

export class UnexpectedErrorResponseBodyError extends Error {
	public status: number;
	public data: unknown;

	constructor(status: number, data: unknown) {
		super("Unexpected error response body");
		this.status = status;
		this.data = data;
	}
}
