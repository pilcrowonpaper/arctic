---
title: "Reddit"
---

# Reddit

OAuth 2.0 provider for Reddit.

Also see the [OAuth 2.0](/guides/oauth2) guide.

## Initialization

```ts
import * as arctic from "arctic";

const patreon = new arctic.Reddit(clientId, clientSecret, redirectURI);
```

## Create authorization URL

```ts
import * as arctic from "arctic";

const state = arctic.generateState();
const scopes = ["edit", "read"];
const url = reddit.createAuthorizationURL(state, scopes);
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), [`UnexpectedResponseError`](/reference/main/UnexpectedResponseError), or [`UnexpectedErrorResponseBodyError`](/reference/main/UnexpectedErrorResponseBodyError). Reddit returns an access token and its expiration.

```ts
import * as arctic from "arctic";

try {
	const tokens = await reddit.validateAuthorizationCode(code);
	const accessToken = tokens.accessToken();
	const accessTokenExpiresAt = tokens.accessTokenExpiresAt();
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

Set the `duration` parameter to `permanent` to get refresh tokens.

```ts
const url = reddit.createAuthorizationURL(state, scopes);
url.searchParams.set("duration", "permanent");
```

```ts
const tokens = await reddit.validateAuthorizationCode(code);
const accessToken = tokens.accessToken();
const accessTokenExpiresAt = tokens.accessTokenExpiresAt();
const refreshToken = tokens.refreshToken();
```

Use `refreshAccessToken()` to get a new access token using a refresh token. Reddit returns the same values as during the authorization code validation. This method also returns `OAuth2Tokens` and throws the same errors as `validateAuthorizationCode()`

```ts
import * as arctic from "arctic";

try {
	const tokens = await reddit.refreshAccessToken(refreshToken);
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

Use the `/me` endpoint.

```ts
const response = await fetch("https://oauth.reddit.com/api/v1/me", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```
