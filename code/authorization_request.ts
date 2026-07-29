// GET https://example.com/oauth/google

/*
Example code for a route that redirects the user to the authorization server (authorization request).

Uint8Array.toHex() is supported on Node.js 25, the latest version of Deno, and the latest version of Deno.

This file is licensed under the Zero-Clause BSD license (see ./LICENSE).
You're free to use, copy, modify, and distribute it without any attribution.
*/

// Generate 32 random bytes and encode it into a string with hex encoding (64-character string).
const nonceSource = new Uint8Array(32);
crypto.getRandomValues(nonceSource);
const nonce = nonceSource.toHex();

// Use the authorization server's authorization endpoint.
const authorizationURL = new URL("https://accounts.google.com/o/oauth2/v2/auth");

authorizationURL.searchParams.set("response_type", "code");
authorizationURL.searchParams.set("client_id", GOOGLE_OAUTH_CLIENT_ID);

// Set it to the URL that handles the callback.
// Optional if you set the redirect URI when registering your OAuth client.
authorizationURL.searchParams.set("redirect_uri", "https://example.com/oauth/google/callback");

authorizationURL.searchParams.set("state", nonce);

// Space delimitated-list.
authorizationURL.searchParams.set("scope", "openid email");

// Remember to update the Path attribute.
todo.setResponseHeader(
	"Set-Cookie",
	`google_oauth_state=${nonce}; Path=/oauth/google; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
);
todo.setResponseHeader("Location", authorizationURL.toString());

todo.setResponseStatusCode(307);
