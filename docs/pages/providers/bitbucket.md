---
title: "Bitbucket"
---

# Bitbucket

OAuth 2.0 provider for Bitbucket.

Also see the [OAuth 2.0](/guides/oauth2) guide.

## Initialization

```ts
import { Bitbucket } from "arctic";

const bitBucket = new Bitbucket(clientId, clientSecret, redirectURI);
```

## Create authorization URL

```ts
import { generateState } from "arctic";

const state = generateState();
const url = bitBucket.createAuthorizationURL(state);
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), or a standard `Error` (parse errors). BitBucket returns an access token and a refresh token.

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await bitBucket.validateAuthorizationCode(code);
	// Accessing other fields will throw an error
	const accessToken = tokens.accessToken();
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

Use `refreshAccessToken()` to get a new access token using a refresh token. This method's behavior is identical to `validateAuthorizationCode()`.

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await bitBucket.refreshAccessToken(accessToken);
	// Accessing other fields will throw an error
	const accessToken = tokens.accessToken();
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

Enable the `account` scope on your account page and use the [`/user` endpoint](https://developer.atlassian.com/cloud/bitbucket/rest/api-group-users/#api-user-get).

```ts
const response = await fetch("https://api.bitbucket.org/2.0/user", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```
