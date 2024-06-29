import { TokenRequestResult, OAuth2RequestContext } from "@oslojs/oauth2";
import { OAuth2Tokens } from "./oauth2.js";

export async function sendTokenRequest(
	url: string,
	context: OAuth2RequestContext
): Promise<OAuth2Tokens> {
	const body = new URLSearchParams();
	for (const [key, value] of context.body) {
		body.set(key, value);
	}
	let response: Response;
	try {
		response = await fetch(url, {
			method: context.method,
			headers: new Headers(Array.from(context.headers.entries())),
			body
		});
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
	const result = new TokenRequestResult(data);
	if (result.hasErrorCode()) {
		const code = result.errorCode();
		let description: string | null = null;
		if (result.hasErrorDescription()) {
			description = result.errorDescription();
		}
		let uri: string | null = null;
		if (result.hasErrorURI()) {
			uri = result.errorURI();
		}
		let state: string | null = null;
		if ("state" in data && typeof data.state === "string") {
			state = result.state();
		}
		throw new OAuth2RequestError(code, description, uri, state);
	}
	return new OAuth2Tokens(data);
}

export async function sendTokenRevocationRequest(
	url: string,
	context: OAuth2RequestContext
): Promise<void> {
	const body = new URLSearchParams();
	for (const [key, value] of context.body) {
		body.set(key, value);
	}
	let response: Response;
	try {
		response = await fetch(url, {
			method: context.method,
			headers: new Headers(Array.from(context.headers.entries())),
			body
		});
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
	const result = new TokenRequestResult(data);
	if (result.hasErrorCode()) {
		const code = result.errorCode();
		let description: string | null = null;
		if (result.hasErrorDescription()) {
			description = result.errorDescription();
		}
		let uri: string | null = null;
		if (result.hasErrorURI()) {
			uri = result.errorURI();
		}
		let state: string | null = null;
		if ("state" in data && typeof data.state === "string") {
			state = result.state();
		}
		throw new OAuth2RequestError(code, description, uri, state);
	}
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
