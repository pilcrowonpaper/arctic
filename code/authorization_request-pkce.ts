// GET https://example.com/oauth/google

/*
Example code for a route that redirects the user to the authorization server (authorization request).

Uint8Array.toHex() and Uint8Array.toBase64() are supported on Node.js 25, the latest version of Deno, and the latest version of Deno.

This file is licensed under the Zero-Clause BSD license (see ./LICENSE).
You're free to use, copy, modify, and distribute it without any attribution.
*/

// Generate 32 random bytes and encode it into a string with hex encoding (64-character string).
const codeVerifierSource = new Uint8Array(32);
crypto.getRandomValues(codeVerifierSource);
const codeVerifier = codeVerifierSource.toHex();

// Hash the code verifier with SHA-256 and encode it into a string with Base64url.
const codeVerifierBytes = new TextEncoder().encode(codeVerifier);
const codeChallengeBuffer = await crypto.subtle.digest("SHA-256", codeVerifierBytes);
const codeChallenge = new Uint8Array(codeChallengeBuffer).toBase64({
	alphabet: "base64url",
	omitPadding: true,
});

// Use the authorization server's authorization endpoint.
const authorizationURL = new URL("https://accounts.google.com/o/oauth2/v2/auth");

authorizationURL.searchParams.set("response_type", "code");
authorizationURL.searchParams.set("client_id", GOOGLE_OAUTH_CLIENT_ID);

// Set it to the URL that handles the callback.
// Optional if you set the redirect URI when registering your OAuth client.
authorizationURL.searchParams.set("redirect_uri", "https://example.com/oauth/google/callback");

authorizationURL.searchParams.set("code_challenge", codeChallenge);
authorizationURL.searchParams.set("code_challenge_method", "S256");

// Space delimitated-list.
authorizationURL.searchParams.set("scope", "openid email");

todo.setResponseHeader(
	"Set-Cookie",
	`google_oauth_code_verifier=${codeVerifier}; Path=/oauth/google; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
);
todo.setResponseHeader("Location", authorizationURL.toString());

todo.setResponseStatusCode(307);
