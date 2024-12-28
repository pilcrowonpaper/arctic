---
title: "WorkOS"
---

# WorkOS

OAuth 2.0 provider for WorkOS.

Also see the [OAuth 2.0](/guides/oauth2) guide.

## Initialization

Pass the client secret for confidential clients.

```ts
import * as arctic from "arctic";

const workos = new arctic.WorkOS(clientId, clientSecret, redirectURI);
const workos = new arctic.WorkOS(clientId, null, redirectURI);
```

## Create authorization URL

```ts
import * as arctic from "arctic";

const state = arctic.generateState();
const url = workos.createAuthorizationURL(state);
```

## Validate authorization code

For confidential clients, pass the authorization code.

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), [`UnexpectedResponseError`](/reference/main/UnexpectedResponseError), or [`UnexpectedErrorResponseBodyError`](/reference/main/UnexpectedErrorResponseBodyError). WorkOS will only return an access token (no expiration).

```ts
import * as arctic from "arctic";

try {
	const tokens = await workos.validateAuthorizationCode(code, null);
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

For public clients, pass the authorization code and code verifier.

```ts
const tokens = await workos.validateAuthorizationCode(code, codeVerifier);
```

## Get user profile

The [profile](https://workos.com/docs/reference/sso/profile) is included in the token response.

```ts
const tokens = await workos.validateAuthorizationCode(code);
if (
	"profile" in tokens.data &&
	typeof tokens.data.profile === "object" &&
	tokens.data.profile !== null
) {
	const profile = tokens.data.profile;
}
```
