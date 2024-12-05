---
title: "Start.gg"
---

# Start.gg

OAuth 2.0 provider for Start.gg.

Also see the [OAuth 2.0](/guides/oauth2) guide.

## Initialization

```ts
import { StartGG } from "arctic";

const startgg = new StartGG(clientId, clientSecret, redirectURI);
```

## Create authorization URL

```ts
import { generateState } from "arctic";

const state = generateState();
const scopes = ["user.identity", "user.email"];
const url = startgg.createAuthorizationURL(state, scopes);
```

## Validate authorization code

Start.gg requires a list of scopes in addition to the authorization code. `validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), or a standard `Error` (parse errors). Start.gg returns an access token, the access token expiration, and a refresh token.

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await startgg.validateAuthorizationCode(code, scopes);
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

Use `refreshAccessToken()` to get a new access token using a refresh token. Start.gg returns the same values as during the authorization code validation. This method also returns `OAuth2Tokens` and throws the same errors as `validateAuthorizationCode()`

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	// Pass an empty `scopes` array to keep using the same scopes.
	const tokens = await startgg.refreshAccessToken(refreshToken, scopes);
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

Add the `user.identity` scope and optionally the `user.email` to get the user email. See the [Start.gg Schema](https://developer.start.gg/reference/user.doc).

```ts
const response = await fetch("https://api.start.gg/gql/alpha", {
	method: "POST",
	body: `{"query": "{ currentUser {id slug email player { gamerTag } } }" }`,
	headers: {
		"Content-type": "application/json",
		Authorization: `Bearer ${accessToken}`
	}
});
const result = await response.json();
```
