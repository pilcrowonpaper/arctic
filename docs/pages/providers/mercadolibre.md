---
title: "MercadoLibre"
---

# MercadoLibre

OAuth 2.0 provider for MercadoLibre.

Also see the [OAuth 2.0](/guides/oauth2) guide for confidential clients and the [OAuth 2.0 with PKCE](/guides/oauth2-pkce) guide for public clients.

## Initialization

The domain should not include the protocol or path.

```ts
import * as arctic from "arctic";

const mercadolibre = new arctic.MercadoLibre(clientId, clientSecret, redirectURI);
```

## Create authorization URL

```ts
import * as arctic from "arctic";

const state = arctic.generateState();
const url = mercadolibre.createAuthorizationURL(state);
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), [`UnexpectedResponseError`](/reference/main/UnexpectedResponseError), or [`UnexpectedErrorResponseBodyError`](/reference/main/UnexpectedErrorResponseBodyError). MercadoLibre returns an access token, its expiration, and a refresh token.

```ts
import * as arctic from "arctic";

try {
	const tokens = await mercadolibre.validateAuthorizationCode(code);
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

Use `refreshAccessToken()` to get a new access token using a refresh token. MercadoLibre returns the same values as during the authorization code validation. This method also returns `OAuth2Tokens` and throws the same errors as `validateAuthorizationCode()`

```ts
import * as arctic from "arctic";

try {
	const tokens = await mercadolibre.refreshAccessToken(refreshToken);
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

Use the [`/users/me` endpoint](https://developers.mercadolibre.com.ar/es_ar/consulta-usuarios#Consultar-mis-datos-personales).

Getting the user profile depends of the service you are connecting to. Learn more at [MercadoLibre](https://www.mercadolibre.com.ar/developers/es/reference/oauth/_oauth_token/post).

```ts
const response = await fetch("https://api.mercadolibre.com/users/me", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```
