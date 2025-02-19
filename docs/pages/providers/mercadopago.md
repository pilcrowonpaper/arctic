---
title: "MercadoPago"
---

# MercadoPago

OAuth 2.0 provider for MercadoPago.

Also see the [OAuth 2.0](/guides/oauth2) guide for confidential clients and the [OAuth 2.0 with PKCE](/guides/oauth2-pkce) guide for public clients.

## Initialization

The domain should not include the protocol or path.

```ts
import * as arctic from "arctic";

const mercadopago = new arctic.MercadoPago(clientId, clientSecret, redirectURI);
```

## Create authorization URL

```ts
import * as arctic from "arctic";

const state = arctic.generateState();
const url = mercadopago.createAuthorizationURL(state);
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), [`UnexpectedResponseError`](/reference/main/UnexpectedResponseError), or [`UnexpectedErrorResponseBodyError`](/reference/main/UnexpectedErrorResponseBodyError). MercadoPago returns an access token, its expiration, and a refresh token.

```ts
import * as arctic from "arctic";

try {
	const tokens = await mercadopago.validateAuthorizationCode(code);
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

## Refresh access tokens

> This flow can only be used if the application return the `scope` parameter indicating the value `offline_access` and the vendor has previously authorized this action through the Authorization code flow.

Use `refreshAccessToken()` to get a new access token using a refresh token. MercadoPago returns the same values as during the authorization code validation. This method also returns `OAuth2Tokens` and throws the same errors as `validateAuthorizationCode()`

```ts
import * as arctic from "arctic";

try {
	const tokens = await mercadopago.refreshAccessToken(refreshToken);
	const accessToken = tokens.accessToken();
	const accessTokenExpiresAt = tokens.accessTokenExpiresAt();
	const refreshToken = tokens.refreshToken();
} catch (e) {
	if (e instanceof arctic.OAuth2RequestError) {
		// Invalid authorization code, credentials, or redirect URI
	}
	if (e instanceof arctic.ArcticFetchError) {
		// Failed to call `fetch()`
	}
	// Parse error
}
```

## Get user profile

Getting the user profile depends of the service you are connecting to. Learn more at [MercadoPago](https://www.mercadopago.com.ar/developers/es/reference/oauth/_oauth_token/post).
