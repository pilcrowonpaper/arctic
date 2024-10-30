---
title: "Epic Games"
---

# Epic Games

OAuth 2.0 provider for Epic Games.

Also see the [OAuth 2.0](/guides/oauth2) guide.

## Initialization

```ts
import { EpicGames } from "arctic";

const epicgames = new EpicGames(clientId, clientSecret, redirectURI);
```

## Create authorization URL

```ts
import { generateState } from "arctic";

const state = generateState();
const scopes = ["basic_profile", "friends_list"];
const url = epicgames.createAuthorizationURL(state, scopes);
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), or a standard `Error` (parse errors). Epic returns an access token, the access token expiration, and a refresh token.

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await epicgames.validateAuthorizationCode(code);
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

The refresh token expiration is returned as `refresh_expires` and `refresh_expires_at`.

```ts
const tokens = await epicgames.validateAuthorizationCode(code);
if ("refresh_expires" in tokens.data && typeof tokens.data.refresh_expires === "number") {
	const refreshTokenExpiresInSeconds = tokens.data.refresh_expires;
}
```

```ts
const tokens = await epicgames.validateAuthorizationCode(code);
if ("refresh_expires_at" in tokens.data && typeof tokens.data.refresh_expires_at === "string") {
	const refreshTokenExpiresAt = new Date(tokens.data.refresh_expires_at);
}
```

## Refresh access tokens

Use `refreshAccessToken()` to get a new access token using a refresh token. Epic returns the same values as during the authorization code validation. This method also returns `OAuth2Tokens` and throws the same errors as `validateAuthorizationCode()`

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await epicgames.refreshAccessToken(accessToken);
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

Add the `basic_profile` scope and use the [`/v2/userInfo` endpoint](https://dev.epicgames.com/docs/epic-account-services/getting-started#endpoints).

```ts
const scopes = ["basic_profile"];
const url = epic.createAuthorizationURL(state, scopes);
```

```ts
const response = await fetch("https://api.epicgames.dev/epic/oauth/v2/userInfo", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```

## Revoke tokens

Pass a token to `revokeToken()` to revoke all tokens associated with the authorization. This can throw the same errors as `validateAuthorizationCode()`.

```ts
try {
	await epic.revokeToken(token);
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
