import { parseJWT } from "@oslojs/jwt";

export function decodeIdToken(idToken: string): object {
	try {
		const [_header, payload, _signature] = parseJWT(idToken);
		return payload;
	} catch (e) {
		throw new Error("Invalid ID token", {
			cause: e
		});
	}
}
