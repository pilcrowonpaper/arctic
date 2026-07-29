/*
Example code for making a token revocation request.

This file is licensed under the Zero-Clause BSD license (see ./LICENSE).
You're free to use, copy, modify, and distribute it without any attribution.
*/

// The current access or refresh token.
// Some authorization servers may not support revocating access tokens.
let token: string;

// Create an application/x-www-form-urlencoded request body.
const accessTokenRequestBody = new URLSearchParams();
accessTokenRequestBody.set("token", token);

// Same as the access token request in the authorization code exchange.
// You may need to use the Authorization header.
accessTokenRequestBody.set("client_id", GOOGLE_OAUTH_CLIENT_ID);
accessTokenRequestBody.set("client_secret", GOOGLE_OAUTH_CLIENT_SECRET);

// Use the authorization server's token revocation endpoint.
const accessTokenRequest = new Request("https://oauth2.googleapis.com/revoke", {
	method: "POST",
	body: accessTokenRequestBody,
});

accessTokenRequest.headers.set("Accept", "application/json");

const accessTokenResponse = await fetch(accessTokenRequest);

// An error response could indicate the refresh token is no longer valid, the request is malformed, or the client credentials are invalid.
if (accessTokenResponse.status !== 200) {
	const accessTokenResponseBodyJSONObject = await accessTokenResponse.json();
	const errorCode: string = accessTokenResponseBodyJSONObject.error;
	throw new Error(`Failed to revoke token: ${errorCode}`);
}

// Success!
