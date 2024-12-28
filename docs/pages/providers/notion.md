---
title: "Notion"
---

# Notion

OAuth 2.0 provider for Notion.

Also see the [OAuth 2.0](/guides/oauth2) guide.

## Initialization

```ts
import * as arctic from "arctic";

const notion = new arctic.Notion(clientId, clientSecret, redirectURI);
```

## Create authorization URL

```ts
import * as arctic from "arctic";

const state = arctic.generateState();
const url = notion.createAuthorizationURL(state);
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), [`UnexpectedResponseError`](/reference/main/UnexpectedResponseError), or [`UnexpectedErrorResponseBodyError`](/reference/main/UnexpectedErrorResponseBodyError). Notion will only return an access token (no expiration).

```ts
import * as arctic from "arctic";

try {
	const tokens = await notion.validateAuthorizationCode(code);
	const accessToken = tokens.accessToken();
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

Use the [`/users/me` endpoint](https://developers.notion.com/reference/get-self).

```ts
const response = await fetch("https://api.notion.com/v1/users/me", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```
