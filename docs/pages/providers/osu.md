---
title: "osu!"
---

# osu!

OAuth 2.0 provider for osu!

Also see the [OAuth 2.0](/guides/oauth2) guide.

## Initialization

```ts
import { Osu } from "arctic";

const osu = new Osu(clientId, clientSecret, redirectURI);
```

## Create authorization URL

Use `addScopes()` to define scopes.

```ts
import { generateState } from "arctic";

const state = generateState();
const url = osu.createAuthorizationURL(state);
url.addScopes("public", "friends.read");
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), or a standard `Error` (parse errors). osu! returns an access token, the access token expiration, and a refresh token.

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await osu.validateAuthorizationCode(code);
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

Use `refreshAccessToken()` to get a new access token using a refresh token. osu! returns the same values as during the authorization code validation. This method also returns `OAuth2Tokens` and throws the same errors as `validateAuthorizationCode()`

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await osu.refreshAccessToken(accessToken);
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

Use the [`/me` endpoint](https://osu.ppy.sh/docs/index.html#get-own-data).

```ts
const response = await fetch("https://osu.ppy.sh/api/v2/me", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```
