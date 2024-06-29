---
title: "AniList"
---

# AniList

OAuth 2.0 provider for AniList.

Also see the [OAuth 2.0](/guides/oauth2) guide.

## Initialization

```ts
import { AniList } from "arctic";

const aniList = new AniList(clientId, clientSecret, redirectURI);
```

## Create authorization URL

```ts
import { generateState } from "arctic";

const state = generateState();
const url = aniList.createAuthorizationURL(state);
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), or a standard `Error` (parse errors). AniList will only return an access token (no expiration).

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await aniList.validateAuthorizationCode(code);
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
