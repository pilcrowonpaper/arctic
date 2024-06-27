import { base64url } from "@oslojs/encoding";

export function decodeIdToken(idToken: string): object {
	const parts = idToken.split(".");
	if (parts.length !== 3) {
		throw new Error("Invalid ID token");
	}
	let header: unknown;
	try {
		header = JSON.parse(new TextDecoder().decode(base64url.decodeIgnorePadding(parts[0])));
	} catch {
		throw new Error("Invalid ID token");
	}
	if (typeof header !== "object" || header === null) {
		throw new Error("Invalid ID token");
	}
	if (typeof header !== "object" || header === null) {
		throw new Error("Invalid ID token");
	}
	if (!("typ" in header) || typeof header.typ !== "string") {
		throw new Error("Invalid ID token");
	}
	if (header.typ !== "JWT") {
		throw new Error("Invalid ID token");
	}
	let payload: unknown;
	try {
		payload = JSON.parse(new TextDecoder().decode(base64url.decodeIgnorePadding(parts[1])));
	} catch {
		throw new Error("Invalid ID token");
	}
	if (typeof payload !== "object" || payload === null) {
		throw new Error("Invalid ID token");
	}
	return payload;
}
