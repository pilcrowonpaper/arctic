---
title: "Patreon"
---

# Patreon

OAuth 2.0 provider for Patreon.

Also see the [OAuth 2.0](/guides/oauth2) guide.

## Initialization

```ts
import { Patreon } from "arctic";

const patreon = new Patreon(clientId, clientSecret, redirectURI);
```

## Create authorization URL

```ts
import { generateState } from "arctic";

const state = generateState();
const scopes = ["identify", "identity[email]"];
const url = patreon.createAuthorizationURL(state, scopes);
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), or a standard `Error` (parse errors). Patreon returns an access token, the access token expiration, and a refresh token.

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await patreon.validateAuthorizationCode(code);
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

Use `refreshAccessToken()` to get a new access token using a refresh token. Patreon returns the same values as during the authorization code validation. This method also returns `OAuth2Tokens` and throws the same errors as `validateAuthorizationCode()`

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await patreon.refreshAccessToken(refreshToken);
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

Add the `identity` scope and use the [`/api/oauth2/v2/identity` endpoint](https://docs.patreon.com/#get-api-oauth2-v2-identity). Optionally add the `identity[email]` scope to get user email.

```ts
const scopes = ["identify", "identity[email]"];
const url = patreon.createAuthorizationURL(state, scopes);
```

```ts
const response = await fetch("https://www.patreon.com/api/oauth2/v2/identity", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```
