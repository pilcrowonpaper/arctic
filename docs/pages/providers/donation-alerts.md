---
title: "DonationAlerts"
---

# DonationAlerts

OAuth 2.0 provider for DonationAlerts.

Also see the [OAuth 2.0](/guides/oauth2) guide.

## Initialization

```ts
import * as arctic from "arctic";

const donationAlerts = new arctic.DonationAlerts(clientId, clientSecret, redirectURI);
```

## Create authorization URL

```ts
import * as arctic from "arctic";

const scopes = ["oauth-user-show"];
const url = donationAlerts.createAuthorizationURL(scopes);
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), [`UnexpectedResponseError`](/reference/main/UnexpectedResponseError), or [`UnexpectedErrorResponseBodyError`](/reference/main/UnexpectedErrorResponseBodyError). DonationAlerts returns an access token, the access token expiration, and a refresh token.

```ts
import * as arctic from "arctic";

try {
	const tokens = await donationAlerts.validateAuthorizationCode(code);
	const accessToken = tokens.accessToken();
	const accessTokenExpiresAt = tokens.accessTokenExpiresAt();
	const refreshToken = tokens.refreshToken();
} catch (e) {
	if (e instanceof arctic.OAuth2RequestError) {
		// Invalid authorization code, credentials, or redirect URI
		const code = e.code;
		// ...
	}
	if (e instanceof arctic.ArcticFetchError) {
		// Failed to call `fetch()`
		const cause = e.cause;
		// ...
	}
	// Parse error
}
```

## Refresh access tokens

Use `refreshAccessToken()` to get a new access token using a refresh token. DonationAlerts returns the same values as during the authorization code validation. This method also returns `OAuth2Tokens` and throws the same errors as `validateAuthorizationCode()`

```ts
import * as arctic from "arctic";

try {
	const scopes = ["oauth-user-show"];
	const tokens = await donationAlerts.refreshAccessToken(refreshToken, scopes);
	const accessToken = tokens.accessToken();
	const accessTokenExpiresAt = tokens.accessTokenExpiresAt();
} catch (e) {
	if (e instanceof arctic.OAuth2RequestError) {
		// Invalid authorization code, credentials, or redirect URI
	}
	if (e instanceof arctic.ArcticFetchError) {
		// Failed to call `fetch()`
	}
	// Parse error
}
```

### Get user profile

Add the `oauth-user-show` scope when creating the authorization URL.

```ts
const scopes = ["oauth-user-show"];
const url = donationAlerts.createAuthorizationURL(scopes);
```

Then in your callback make a request to the DonationAlerts API.

```ts
const tokens = await donationAlerts.validateAuthorizationCode(code);

const response = await fetch("https://www.donationalerts.com/api/v1/user/oauth", {
	headers: {
		Authorization: `Bearer ${tokens.accessToken()}`
	}
});
const user = await response.json();
```
