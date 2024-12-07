---
title: "Linear"
---

# Linear

OAuth 2.0 provider for Linear.

Also see the [OAuth 2.0](/guides/oauth2) guide.

## Initialization

```ts
import { Linear } from "arctic";

const linear = new Linear(clientId, clientSecret, redirectURI);
```

## Create authorization URL

**The `read` scope must always be included.**

```ts
import { generateState } from "arctic";

const state = generateState();
const scopes = ["read", "write"];
const url = linear.createAuthorizationURL(state, scopes);
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), [`UnexpectedResponseError`](/reference/main/UnexpectedResponseError), or [`UnexpectedErrorResponseBodyError`](/reference/main/UnexpectedErrorResponseBodyError). Linear will return an access token with an expiration.

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await linear.validateAuthorizationCode(code);
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

Use Linear's [GraphQL API](https://developers.linear.app/docs/graphql/working-with-the-graphql-api).

```ts
const response = await fetch("https://api.linear.app/graphql", {
    method: "POST",
    body: `{ "query": "{ viewer { id name } }" }`,
	headers: {
        "Content-Type": "application/json"
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```
