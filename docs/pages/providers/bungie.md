---
title: "Bungie"
---

# Bungie

OAuth 2.0 provider for Bungie. Only supports confidential clients.

Also see the [OAuth 2.0](/guides/oauth2) guide.

## Initialization

Pass the client secret for confidential clients.

```ts
import * as arctic from "arctic";

const bungie = new arctic.Bungie(clientId, clientSecret, redirectURI);
const bungie = new arctic.Bungie(clientId, null, redirectURI);
```

## Create authorization URL

```ts
import * as arctic from "arctic";

const state = arctic.generateState();
const scopes = ["ReadBasicUserProfile", "ReadGroups"];
const url = bungie.createAuthorizationURL(state, scopes);
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), [`UnexpectedResponseError`](/reference/main/UnexpectedResponseError), or [`UnexpectedErrorResponseBodyError`](/reference/main/UnexpectedErrorResponseBodyError)..

```ts
import * as arctic from "arctic";

try {
	const tokens = await bungie.validateAuthorizationCode(code);
	const accessToken = tokens.accessToken();
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

Refresh tokens are only provided for confidential clients.

```ts
const tokens = await bungie.validateAuthorizationCode(code);
const accessToken = tokens.accessToken();
const accessTokenExpiresAt = tokens.accessTokenExpiresAt();
const refreshToken = tokens.refreshToken();
```

The refresh token expiration is returned as `refresh_expires_in`.

```ts
const tokens = await bungie.validateAuthorizationCode(code);
if ("refresh_expires_in" in tokens.data && typeof tokens.data.refresh_expires_in === "number") {
	const refreshTokenExpiresIn = tokens.data.refresh_expires_in;
}
```

## Refresh access tokens

Use `refreshAccessToken()` to get a new access token using a refresh token. The behavior is identical to `validateAuthorizationCode()`.

```ts
import * as arctic from "arctic";

try {
	const tokens = await bungie.refreshAccessToken(refreshToken);
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

Use the [`GetCurrentBungieNetUser` endpoint](https://destinydevs.github.io/BungieNetPlatform/docs/services/User/User-GetCurrentBungieNetUser).

```ts
const response = await fetch("https://www.bungie.net/Platform/User/GetCurrentBungieNetUser", {
	headers: {
		Authorization: `Bearer ${accessToken}`,
		"X-API-Key": apiKey
	}
});
const emails = await response.json();
```
