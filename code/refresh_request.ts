/*
Example code for making a refresh request.

This file is licensed under the Zero-Clause BSD license (see ./LICENSE).
You're free to use, copy, modify, and distribute it without any attribution.
*/

// The current refresh token.
let refreshToken: string;

// Create an application/x-www-form-urlencoded request body.
const accessTokenRequestBody = new URLSearchParams();
accessTokenRequestBody.set("grant_type", "refresh_token");
accessTokenRequestBody.set("refresh_token", refreshToken);

// Same as the access token request in the authorization code exchange.
// You may need to use the Authorization header.
accessTokenRequestBody.set("client_id", GOOGLE_OAUTH_CLIENT_ID);
accessTokenRequestBody.set("client_secret", GOOGLE_OAUTH_CLIENT_SECRET);

// Use the authorization server's token endpoint.
const accessTokenRequest = new Request("https://oauth2.googleapis.com/token", {
	method: "POST",
	body: accessTokenRequestBody,
});

accessTokenRequest.headers.set("Accept", "application/json");

const accessTokenResponse = await fetch(accessTokenRequest);

// An error response could indicate the refresh token is no longer valid, the request is malformed, or the client credentials are invalid.
// Note: GitHub always return a 200 response. Check the error field directly instead.
if (accessTokenResponse.status !== 200) {
	const accessTokenResponseBodyJSONObject = await accessTokenResponse.json();
	const errorCode: string = accessTokenResponseBodyJSONObject.error;
	throw new Error(`Failed to refresh access token: ${errorCode}`);
}

const accessTokenResponseBodyJSONObject = await accessTokenResponse.json();
const newAccessToken: string = accessTokenResponseBodyJSONObject.access_token;
const newAccessTokenExpiresIn: number = accessTokenResponseBodyJSONObject.expires_in;

// Some authorization servers may issue a new refresh token (invalidating the old one) or may continue to use the old one.
const newRefreshToken: string = accessTokenResponseBodyJSONObject.refresh_token;
