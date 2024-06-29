---
title: "VK"
---

# VK

OAuth 2.0 provider for VK.

Also see the [OAuth 2.0](/guides/oauth2) guide.

## Initialization

```ts
import { VK } from "arctic";

const vk = new VK(clientId, clientSecret, redirectURI);
```

## Create authorization URL

Use `addScopes()` to define scopes. Optionally use the `offline` scope to get access tokens with no expiration.

```ts
import { generateState } from "arctic";

const state = generateState();
const url = vk.createAuthorizationURL(state);
url.addScopes("email", "messages", "offline");
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), or a standard `Error` (parse errors). VK will return an access token.

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await vk.validateAuthorizationCode(code);
	const accessToken = tokens.accessToken();
	// Only if `offline` scope is not used.
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

Use the [`users.get` endpoint](https://dev.vk.com/en/method/users.get).

```ts
const response = await fetch("https://api.vk.com/method/users.get", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```
