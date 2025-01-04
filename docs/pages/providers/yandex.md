---
title: "Yandex"
---

# Yandex

OAuth 2.0 provider for Yandex.

Also see the [OAuth 2.0](/guides/oauth2) guide.

## Initialization

```ts
import * as arctic from "arctic";

const yandex = new arctic.Yandex(clientId, clientSecret, redirectURI);
```

## Create authorization URL

```ts
import * as arctic from "arctic";

const state = arctic.generateState();
const scopes = ["activity:write", "read"];
const url = yandex.createAuthorizationURL(state, scopes);
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), [`UnexpectedResponseError`](/reference/main/UnexpectedResponseError), or [`UnexpectedErrorResponseBodyError`](/reference/main/UnexpectedErrorResponseBodyError). Yandex returns an access token, the access token expiration, and a refresh token.

```ts
import * as arctic from "arctic";

try {
	const tokens = await yandex.validateAuthorizationCode(code);
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

Use `refreshAccessToken()` to get a new access token using a refresh token. Yandex returns the same values as during the authorization code validation. This method also returns `OAuth2Tokens` and throws the same errors as `validateAuthorizationCode()`

```ts
import * as arctic from "arctic";

try {
	const tokens = await yandex.refreshAccessToken(refreshToken);
	const accessToken = tokens.accessToken();
	const accessTokenExpiresAt = tokens.accessTokenExpiresAt();
	const refreshToken = tokens.refreshToken();
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

## Get user profile

Use the [`/myself` endpoint](https://yandex.cloud/en/docs/tracker/get-user-info?utm_referrer=https%3A%2F%2Fwww.google.com%2F).

```ts
const response = await fetch("https://api.tracker.yandex.net/v2/myself", {
	headers: {
		Authorization: `OAuth ${accessToken}`,
		"X-Org-ID": ORGANIZATION_ID
	}
});
const user = await response.json();
```
