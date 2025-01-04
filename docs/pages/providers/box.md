---
title: "Box"
---

# Box

OAuth 2.0 provider for Box.

Also see the [OAuth 2.0](/guides/oauth2) guide.

## Initialization

```ts
import * as arctic from "arctic";

const box = new arctic.Box(clientId, clientSecret, redirectURI);
```

## Create authorization URL

```ts
import * as arctic from "arctic";

const state = arctic.generateState();
const scopes = ["root_readonly", "manage_managed_users"];
const url = box.createAuthorizationURL(state, scopes);
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), [`UnexpectedResponseError`](/reference/main/UnexpectedResponseError), or [`UnexpectedErrorResponseBodyError`](/reference/main/UnexpectedErrorResponseBodyError). Box will only return an access token (no expiration).

```ts
import * as arctic from "arctic";

try {
	const tokens = await box.validateAuthorizationCode(code);
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

## Get user profile

Use the [`/users/me` endpoint](https://developer.box.com/reference/get-users-me).

```ts
const response = await fetch("https://api.box.com/2.0/users/me", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```

## Refresh access tokens

Use `refreshAccessToken()` to get a new access token using a refresh token. The behavior is identical to `validateAuthorizationCode()`.

```ts
import * as arctic from "arctic";

try {
	const tokens = await box.refreshAccessToken(refreshToken);
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

## Revoke tokens

Revoke tokens with `revokeToken()`. Revoking a refresh token will also invalidate access tokens issued with it. It throws the same errors as `validateAuthorizationCode()`.

```ts
try {
	await box.revokeToken(token);
} catch (e) {
	// Handle errors
}
```
