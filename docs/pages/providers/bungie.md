---
title: "Bungie"
---

# Bungie

OAuth 2.0 provider for Bungie.

Also see the [OAuth 2.0](/guides/oauth2) guide.

## Initialization

Pass a client secret for confidential clients.

```ts
import { Bungie } from "arctic";

const bungie = new Bungie(clientId, clientSecret, redirectURI);
const bungie = new Bungie(clientId, null, redirectURI);
```

## Create authorization URL

```ts
import { generateState } from "arctic";

const state = generateState();
const url = bungie.createAuthorizationURL(state);
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), or a standard `Error` (parse errors).

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await bungie.validateAuthorizationCode(code);
	const accessToken = tokens.accessToken();
} catch (e) {
	if (e instanceof OAuth2RequestError) {
		// Invalid authorization code, credentials, or redirect URI
		const code = e.code;
		// ...
	}
	if (e instanceof ArcticFetchError) {
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
const tokens = await github.validateAuthorizationCode(code);
if ("refresh_expires_in" in tokens.data && typeof tokens.data.refresh_expires_in === "number") {
	const refreshTokenExpiresIn = tokens.data.refresh_expires_in;
}
```

## Refresh access tokens

For confidential clients, use `refreshAccessToken()` to get a new access token using a refresh token. The behavior is identical to `validateAuthorizationCode()`.

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await bungie.refreshAccessToken(accessToken);
	const accessToken = tokens.accessToken();
	const accessTokenExpiresAt = tokens.accessTokenExpiresAt();
	const refreshToken = tokens.refreshToken();
} catch (e) {
	if (e instanceof OAuth2RequestError) {
		// Invalid authorization code, credentials, or redirect URI
	}
	if (e instanceof ArcticFetchError) {
		// Failed to call `fetch()`
	}
	// Parse error
}
```

## Get user profile

Add the `account` scope and use the [`GetCurrentBungieNetUser` endpoint](https://destinydevs.github.io/BungieNetPlatform/docs/services/User/User-GetCurrentBungieNetUser).

```ts
const response = await fetch("https://www.bungie.net/Platform/User/GetCurrentBungieNetUser", {
	headers: {
		Authorization: `Bearer ${accessToken}`,
		"X-API-Key": apiKey
	}
});
const emails = await response.json();
```
