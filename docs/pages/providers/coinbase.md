---
title: "Coinbase"
---

# Coinbase

OAuth 2.0 provider for Coinbase.

Also see the [OAuth 2.0](/guides/oauth2) guide.

## Initialization

```ts
import { Coinbase } from "arctic";

const coinbase = new Coinbase(clientId, clientSecret, redirectURI);
```

## Create authorization URL

Use `addScopes()` to define scopes.

```ts
import { generateState } from "arctic";

const state = generateState();
const url = coinbase.createAuthorizationURL(state);
url.addScopes("wallet:user:email", "wallet:accounts:read");
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), or a standard `Error` (parse errors). Coinbase returns an access token, the access token expiration, and a refresh token.

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await coinbase.validateAuthorizationCode(code);
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

Use `refreshAccessToken()` to get a new access token using a refresh token. This method's behavior is identical to `validateAuthorizationCode()`.

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await coinbase.refreshAccessToken(accessToken);
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

Use the [`/user` endpoint](https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-users#show-current-user).

```ts
const response = await fetch("https://api.coinbase.com/v2/user", {
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
	await coinbase.revokeToken(token);
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
