---
title: "Telegram"
---

# Telegram

OAuth 2.0 authorization code provider for Telegram.

Also see [OAuth 2.0 with PKCE](/guides/oauth2-pkce).

## Initialization

```ts
import * as arctic from "arctic";

const telegram = new arctic.Telegram(clientId, clientSecret, redirectURI);
```

## Create authorization URL

```ts
import * as arctic from "arctic";

const state = arctic.generateState();
const codeVerifier = arctic.generateCodeVerifier();
const scopes = ["openid", "profile"];
const url = telegram.createAuthorizationURL(state, codeVerifier, scopes);
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), [`UnexpectedResponseError`](/reference/main/UnexpectedResponseError), or [`UnexpectedErrorResponseBodyError`](/reference/main/UnexpectedErrorResponseBodyError). Telegram returns an access token with an expiration.

```ts
import * as arctic from "arctic";

try {
	const tokens = await telegram.validateAuthorizationCode(code, codeVerifier);
	const accessToken = tokens.accessToken();
	const accessTokenExpiresAt = tokens.accessTokenExpiresAt();
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

## OpenID Connect

Use OpenID Connect with the `openid` scope to get the user's profile from the ID token. Arctic provides [`decodeIdToken()`](/reference/main/decodeIdToken) for decoding the token's payload. Telegram does not provide a userinfo endpoint.

Also see [ID token claims](https://core.telegram.org/bots/telegram-login#available-scopes).

```ts
const scopes = ["openid", "profile"];
const url = telegram.createAuthorizationURL(state, codeVerifier, scopes);
```

```ts
import * as arctic from "arctic";

const tokens = await telegram.validateAuthorizationCode(code, codeVerifier);
const idToken = tokens.idToken();
const claims = arctic.decodeIdToken(idToken);
```
