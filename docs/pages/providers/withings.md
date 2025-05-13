---
title: "Withings"
---

# Withings

OAuth 2.0 provider for Withings.

Also see the [OAuth 2.0](/guides/oauth2) guide.

## Initialization

```ts
import * as arctic from "arctic";

const withings = new arctic.Withings(clientId, clientSecret, redirectURI);
```

## Create authorization URL

```ts
import * as arctic from "arctic";

const state = arctic.generateState();
const scopes = ["user.info", "user.metrics", "user.activity"];
const url = withings.createAuthorizationURL(state, scopes);
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`ArcticFetchError`](/reference/main/ArcticFetchError), [`UnexpectedResponseError`](/reference/main/UnexpectedResponseError), or [`UnexpectedErrorResponseBodyError`](/reference/main/UnexpectedErrorResponseBodyError). Withings will return an access token with an expiration.

```ts
import * as arctic from "arctic";

try {
	const tokens = await withings.validateAuthorizationCode(code);
	const accessToken = tokens.accessToken();
	const accessTokenExpiresAt = tokens.accessTokenExpiresAt();
} catch (e) {
	if (e instanceof arctic.UnexpectedErrorResponseBodyError) {
		// Invalid authorization code, credentials, or redirect URI
		const responseBody = e.data;
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

## Get measures

Use the `/measure` endpoint. See [the API docs](https://developer.withings.com/api-reference/#tag/measure).

```ts
const response = await fetch("https://wbsapi.withings.net/measure", {
	method: "POST",
	headers: {
       	Authorization: `Bearer ${tokens.accessToken()}`,
		"Content-Type": "application/json"
	},
	body: JSON.stringify({
		action: "getmeas",
		meastypes: "1,5,6,8,76", // weight-related measures
		category: 1,             // real measures
		lastupdate: 1746082800   // May 1, 2025
	})
});
const measures = await response.json();
```
