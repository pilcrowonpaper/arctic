// GET https://example.com/oauth/google/callback?state=STATE&code=AUTHORIZATION_CODE

/*
Example code for a route that handles the authorization request callback and exchanges the authorization code for an access token.

Uint8Array.toBase64() is supported on Node.js 25, the latest version of Deno, and the latest version of Deno.

This file is licensed under the Zero-Clause BSD license (see ./LICENSE).
You're free to use, copy, modify, and distribute it without any attribution.
*/

const callbackState = todo.getRequestURLQueryParameter("state");
const authorizationCode = todo.getRequestURLQueryParameter("code");

const storedState = todo.getRequestCookie("google_oauth_state");

if (callbackState === null || authorizationCode === null || storedState === null) {
	todo.setResponseStatusCode(400);
	return
}

// Check that state is valid to prevent CSRF attacks.
// Overkill but use constant-time comparison to prevent timing attacks.
const stateValid = constantTimeEqualString(storedState, callbackState);
if (!stateValid) {
	todo.setResponseStatusCode(400);
	return
}

// Create an application/x-www-form-urlencoded request body.
const accessTokenRequestBody = new URLSearchParams();
accessTokenRequestBody.set("grant_type", "authorization_code");
accessTokenRequestBody.set("code", authorizationCode);

// Must be the same as the redirect_uri parameter value in the authorization request.
// Must be omitted if it wasn't include in the authorization request.
accessTokenRequestBody.set("redirect_uri", "https://example.com/oauth/google/callback");

// See comment on Authorization header.
// Client secret is optional if you didn't get one when you registered the OAuth client.
accessTokenRequestBody.set("client_id", GOOGLE_OAUTH_CLIENT_ID);
accessTokenRequestBody.set("client_secret", GOOGLE_OAUTH_CLIENT_SECRET);

// Use the authorization server's token endpoint.
const accessTokenRequest = new Request("https://oauth2.googleapis.com/token", {
	method: "POST",
	body: accessTokenRequestBody,
});

accessTokenRequest.headers.set("Accept", "application/json");

// Some authorization servers may require you to send the client ID and secret using the Authorization header
// instead of using the client_id and client_secret request body field.
// This is not required if you're already sending them inside the request body.
const usernameAndPasswordBytes = new TextEncoder().encode(`${GOOGLE_OAUTH_CLIENT_ID}:${GOOGLE_OAUTH_CLIENT_SECRET}`);
const encodedUsernameAndPassword = usernameAndPasswordBytes.toBase64();
accessTokenRequest.headers.set("Authorization", `Basic ${encodedUsernameAndPassword}`);

const accessTokenResponse = await fetch(accessTokenRequest);

// An error response could indicate the authorization code is invalid, the request is malformed, or the client credentials are invalid.
// Note: GitHub always return a 200 response. Check the error field directly instead.
if (accessTokenResponse.status !== 200) {
	const accessTokenResponseBodyJSONObject = await accessTokenResponse.json();
	const errorCode: string = accessTokenResponseBodyJSONObject.error;
	console.log(`Failed to get access token: ${errorCode}`);
	todo.setResponseStatusCode(400);
	return
}

const accessTokenResponseBodyJSONObject = await accessTokenResponse.json();
const accessToken: string = accessTokenResponseBodyJSONObject.access_token;
const accessTokenExpiresIn: number = accessTokenResponseBodyJSONObject.expires_in;

// This may or may not be defined depending on the authorization server.
// Some authorization server may require you to use the access_type query parameter or offline_access scope
// in the authorization request to retrieve a refresh token.
// Some authorization server may only issue a refresh token on the first successful attempt.
const refreshToken: string = accessTokenResponseBodyJSONObject.refresh_token;

function constantTimeEqualString(a: string, b: string): boolean {
	const aBytes = new TextEncoder().encode(a);
	const bBytes = new TextEncoder().encode(b);
	if (aBytes.byteLength !== bBytes.byteLength) {
		return false;
	}
	let c = 0;
	for (let i = 0; i < aBytes.byteLength; i++) {
		c |= aBytes[i] ^ bBytes[i];
	}
	return c === 0;
}
