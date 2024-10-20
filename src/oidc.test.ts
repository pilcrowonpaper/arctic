import { test, expect } from "vitest";
import { decodeIdToken } from "./oidc.js";

test("decodeIdToken()", () => {
	const jwt =
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
	expect(decodeIdToken(jwt)).toStrictEqual({
		sub: "1234567890",
		name: "John Doe",
		iat: 1516239022
	});
});
