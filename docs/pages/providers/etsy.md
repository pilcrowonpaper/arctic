---
title: "Etsy"
---

# Etsy

Implements OAuth 2.0 with PKCE.

For usage, see [OAuth 2.0 provider with PKCE](/guides/oauth2-pkce).

## Initialization

```ts
import * as arctic from "arctic";

const etsy = new arctic.Etsy(clientId, redirectURI);
```

## Create authorization URL

```ts
import * as arctic from "arctic";

const state = arctic.generateState();
const codeVerifier = arctic.generateCodeVerifier();
const scopes = ["listings_r", "listings_w"];

const url: URL = await etsy.createAuthorizationURL(state, codeVerifier, scopes);
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), [`UnexpectedResponseError`](/reference/main/UnexpectedResponseError), or [`UnexpectedErrorResponseBodyError`](/reference/main/UnexpectedErrorResponseBodyError). Etsy returns an access token, the access token expiration, and a refresh token.

```ts
import * as arctic from "arctic";

try {
	const tokens: OAuth2Tokens = await etsy.validateAuthorizationCode(code, codeVerifier);
	const accessToken = tokens.accessToken();
	const accessTokenExpiresAt = tokens.accessTokenExpiresAt();
	const refreshToken = tokens.refreshToken();
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

Add the `shops_r` and `email_r` scope. First use the [`getMe` endpoint](https://developer.etsy.com/documentation/reference#operation/getMe) to get the user's ID.

```ts
const tokens = await etsy.validateAuthorizationCode(code, codeVerifier);
const response = await fetch("https://openapi.etsy.com/v3/application/users/me", {
	headers: {
		"X-Api-Key": clientId,
		Authorization: `Bearer ${tokens.accessToken}`
	}
});
const result = await response.json();
const userId = result.user_id;
```

Then use the [`getUser` endpoint](https://developer.etsy.com/documentation/reference#operation/getUser) with the user ID to get the user's profile.

```ts
const response = await fetch(`https://openapi.etsy.com/v3/application/users/${userId}`, {
	headers: {
		"X-Api-Key": clientId,
		Authorization: `Bearer ${tokens.accessToken}`
	}
});
const user = await response.json();
```
