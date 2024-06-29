---
title: "Facebook"
---

# Facebook

OAuth 2.0 provider for Facebook.

Also see the [OAuth 2.0](/guides/oauth2) guide.

## Initialization

```ts
import { Facebook } from "arctic";

const facebook = new Facebook(clientId, clientSecret, redirectURI);
```

## Create authorization URL

Use `addScopes()` to define scopes.

```ts
import { generateState } from "arctic";

const state = generateState();
const url = facebook.createAuthorizationURL(state);
url.addScopes("email", "public_profile");
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), or a standard `Error` (parse errors). Facebook will return an access token with an expiration.

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await facebook.validateAuthorizationCode(code);
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

Use the `/me` endpoint. See [user fields](https://developers.facebook.com/docs/graph-api/reference/user#Reading).

```ts
const url = new Request("https://graph.facebook.com/me");
url.searchParams.set("access_token", accessToken);
url.searchParams.set("fields", ["id", "name", "picture", "email"].join(","));
const response = await fetch(url);
const user = await response.json();
```
