---
title: "Dribbble"
---

# Dribbble

OAuth 2.0 provider for Dribbble.

Also see the [OAuth 2.0](/guides/oauth2) guide.

## Initialization

```ts
import { Dribble } from "arctic";

const dribble = new Dribble(clientId, clientSecret, redirectURI);
```

## Create authorization URL

Use `addScopes()` to define scopes.

```ts
import { generateState } from "arctic";

const state = generateState();
const url = dribble.createAuthorizationURL(state);
url.addScopes("public", "upload");
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), or a standard `Error` (parse errors). Dribble will only return an access token (no expiration).

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await dribble.validateAuthorizationCode(code);
	const accessToken = tokens.accessToken();
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

Use the [`/user` endpoint](https://developer.dribbble.com/v2/user).

```ts
const response = await fetch("https://api.dribbble.com/v2/user", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```
