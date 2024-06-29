---
title: "Twitch"
---

# Twitch

OAuth 2.0 provider for Twitch.

Also see the [OAuth 2.0](/guides/oauth2) guide.

## Initialization

```ts
import { Twitch } from "arctic";

const twitch = new Twitch(clientId, clientSecret, redirectURI);
```

## Create authorization URL

Use `setScopes()` and `appendScopes()` to define scopes.

```ts
import { generateState } from "arctic";

const state = generateState();
const url = twitch.createAuthorizationURL(state);
url.setScopes("activity:write", "read");
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/OAuth2RequestError), [`ArcticFetchError`](/reference/ArcticFetchError), or a standard `Error` (parse errors). Twitch returns an access token, the access token expiration, and a refresh token.

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await twitch.validateAuthorizationCode(code);
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

Use `refreshAccessToken()` to get a new access token using a refresh token. Twitch the same values as during the authorization code validation. This method throws the same errors as `validateAuthorizationCode()`.

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await twitch.refreshAccessToken(accessToken);
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

Use the [`/users` endpoint](https://dev.twitch.tv/docs/api/reference/#get-users) without passing any arguments. The `user:read:email` scope is required to get the user's email from the endpoint.

```ts
const tokens = await twitch.validateAuthorizationCode(code);
const response = await fetch("https://api.twitch.tv/helix/users", {
	headers: {
		Authorization: `Bearer ${tokens.accessToken}`,
		"Client-Id": clientId
	}
});
const user = await response.json();
```
