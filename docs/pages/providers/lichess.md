---
title: "Lichess"
---

# Lichess

OAuth 2.0 provider for Lichess.

Also see the [OAuth 2.0 with PKCE](/guides/oauth2-pkce) guide.

## Initialization

```ts
import { Lichess } from "arctic";

const lichess = new Lichess(clientId, redirectURI);
```

## Create authorization URL

Use `addScopes()` to define scopes.

```ts
import { generateState, generateCodeVerifier } from "arctic";

const state = generateState();
const codeVerifier = generateCodeVerifier();
const url = lichess.createAuthorizationURL(state, codeVerifier);
url.addScopes("challenge:read", "challenge:write");
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), or a standard `Error` (parse errors). Lichess returns an access token and its expiration.

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await lichess.validateAuthorizationCode(code, codeVerifier);
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

Use the [/api/account](https://lichess.org/api#tag/Account/operation/accountMe) endpoint

```ts
const lichessUserResponse = await fetch("https://lichess.org/api/account", {
	headers: {
		Authorization: `Bearer ${tokens}`
	}
});
const user = await lichessUserResponse.json();
```

## Get user email

Add the `email:read` scope and use the [/api/account/email](https://lichess.org/api#tag/Account/operation/accountEmail) endpoint

```ts
const url = lichess.createAuthorizationURL(state, codeVerifier);
url.addScopes("email:read");
```

```ts
const response = await fetch("https://lichess.org/api/account/email", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const email = await response.json();
```
