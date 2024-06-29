---
title: "Zoom"
---

# Zoom

OAuth 2.0 provider for Zoom.

Also see the [OAuth 2.0](/guides/oauth2) guide.

## Initialization

```ts
import { Zoom } from "arctic";

const zoom = new Zoom(clientId, clientSecret, redirectURI);
```

## Create authorization URL

```ts
import { generateState, generateCodeVerifier } from "arctic";

const state = generateState();
const codeVerifier = generateCodeVerifier();
const url = zoom.createAuthorizationURL(state, codeVerifier);
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), or a standard `Error` (parse errors). Zoom returns an access token, the access token expiration, and a refresh token.

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await zoom.validateAuthorizationCode(code, codeVerifier);
	const accessToken = tokens.accessToken();
	const accessTokenExpiresAt = tokens.accessTokenExpiresAt();
	const refreshToken = tokens.refreshToken();
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

## Refresh access tokens

Use `refreshAccessToken()` to get a new access token using a refresh token. Zoom returns the same values as during the authorization code validation. This method also returns `OAuth2Tokens` and throws the same errors as `validateAuthorizationCode()`

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await zoom.refreshAccessToken(accessToken);
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

Add the `user:read` scope in the app settings and use the [`/users/me` endpoint](https://developers.zoom.us/docs/api/rest/reference/user/methods/#operation/user).

```ts
const response = await fetch("https://api.zoom.us/v2/users/me", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```

## Revoke tokens

Revoke tokens with `revokeToken()`. This can throw the same errors as `validateAuthorizationCode()`.

```ts
try {
	await zoom.revokeToken(token);
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
