---
title: "Box"
---

# Box

OAuth 2.0 provider for Box.

Also see the [OAuth 2.0](/guides/oauth2) guide.

## Initialization

```ts
import { Box } from "arctic";

const box = new Box(clientId, clientSecret, redirectURI);
```

## Create authorization URL

Use `addScopes()` to define scopes.

```ts
import { generateState } from "arctic";

const state = generateState();
const url = box.createAuthorizationURL(state);
url.addScopes("root_readonly", "manage_managed_users");
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), or a standard `Error` (parse errors). Box will only return an access token (no expiration).

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await box.validateAuthorizationCode(code);
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

Use the [`/users/me` endpoint](https://developer.box.com/reference/get-users-me).

```ts
const response = await fetch("https://api.box.com/2.0/users/me", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```

## Revoke tokens

Revoke tokens with `revokeToken()`. Revoking a refresh token will also invalidate access tokens issued with it. It throws the same errors as `validateAuthorizationCode()`.

```ts
try {
	await box.revokeToken(token);
} catch (e) {
	// Handle errors
}
```
