---
title: "Twitter"
---

# Twitter

OAuth 2.0 provider for Twitter API v2.

Also see the [OAuth 2.0 with PKCE](/guides/oauth2-pkce) guide.

## Initialization

```ts
import { Twitter } from "arctic";

const twitter = new Twitter(clientId, clientSecret, redirectURI);
```

## Create authorization URL

Use `addScopes()` to define scopes.

```ts
import { generateState } from "arctic";

const state = generateState();
const url = twitter.createAuthorizationURL(state);
url.addScopes("account_info.read", "files.content.read");
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), or a standard `Error` (parse errors). Twitter returns an access token and its expiration.

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await twitter.validateAuthorizationCode(code, codeVerifier);
	const accessToken = tokens.accessToken();
	const accessTokenExpiresAt = tokens.accessTokenExpiresAt();
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

## Get user profile

Add the `users.read` and `tweet.read` scopes and use the [`/users/me` endpoint](https://developer.twitter.com/en/docs/twitter-api/users/lookup/api-reference/get-users-me). You cannot get user emails with the v2 API.

```ts
const url = twitter.createAuthorizationURL(state, codeVerifier);
url.addScopes("users.read", "tweet.read");
```

```ts
const response = await fetch("https://api.twitter.com/2/users/me", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```

## Refresh access tokens

Add the `offline.access` scope to get refresh tokens.

```ts
const url = twitter.createAuthorizationURL();
url.addScopes("offline.access");
```

```ts
const tokens = await twitter.validateAuthorizationCode(code, codeVerifier);
const accessToken = tokens.accessToken();
const accessTokenExpiresAt = tokens.accessTokenExpiresAt();
const refreshToken = tokens.refreshToken();
```

Use `refreshAccessToken()` to get a new access token using a refresh token. Twitter returns the same values as during the authorization code validation. This method also returns `OAuth2Tokens` and throws the same errors as `validateAuthorizationCode()`

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await twitter.refreshAccessToken(accessToken);
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

## Revoke tokens

Use `revokeToken()` to revoke a token. This can throw the same errors as `validateAuthorizationCode()`.

```ts
try {
	await twitter.revokeToken(refreshToken);
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
