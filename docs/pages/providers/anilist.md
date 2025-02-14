---
title: "AniList"
---

# AniList

OAuth 2.0 provider for AniList.

Also see the [OAuth 2.0](/guides/oauth2) guide.

## Initialization

```ts
import * as arctic from "arctic";

const aniList = new arctic.AniList(clientId, clientSecret, redirectURI);
```

## Create authorization URL

```ts
import * as arctic from "arctic";

const state = arctic.generateState();
const url = aniList.createAuthorizationURL(state);
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), [`UnexpectedResponseError`](/reference/main/UnexpectedResponseError), or [`UnexpectedErrorResponseBodyError`](/reference/main/UnexpectedErrorResponseBodyError). AniList will only return an access token (no expiration).

```ts
import * as arctic from "arctic";

try {
	const tokens = await aniList.validateAuthorizationCode(code);
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

Use the `Viewer` query to get the [user object](https://docs.anilist.co/reference/object/user).

```ts
const query = `query {
	Viewer {
		id
		name
	}
}`;
const response = await fetch("https://graphql.anilist.co", {
	method: "POST",
	headers: {
		Authorization: `Bearer ${tokens.accessToken}`,
		"Content-Type": "application/json",
		Accept: "application/json"
	},
	body: JSON.stringify({
		query
	})
});
const user = await response.json();
```
