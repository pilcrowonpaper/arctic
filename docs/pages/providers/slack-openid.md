---
title: "Slack (OpenID)"
---

# Slack (OpenID)

OAuth 2.0 provider for Slack (OpenID Connect). This is different from Slack provider used to install apps - use [`Slack (App)`](/providers/slack-app) instead.

Also see the [OAuth 2.0](/guides/oauth2) guide.

## Initialization

The redirect URI is optional.

```ts
import { SlackOIDC } from "arctic";

const slack = new SlackOIDC(clientId, clientSecret, null);
const slack = new SlackOIDC(clientId, clientSecret, redirectURI);
```

## Create authorization URL

Use `addScopes()` to define scopes.

**The `openid` scope is required.**

```ts
import { generateState } from "arctic";

const state = generateState();
const url = slack.createAuthorizationURL(state);
url.addScopes("openid", "profile");
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), or a standard `Error` (parse errors). Slack will return an access token (no expiration) and an ID token.

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await slack.validateAuthorizationCode(code);
	const accessToken = tokens.accessToken();
	const idToken = tokens.idToken();
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

Decode the ID token or the `userinfo` endpoint to get the user profile. Arctic provides [`decodeIdToken()`](/reference/main/decodeIdToken) for decoding the token's payload.

```ts
import { decodeIdToken } from "arctic";

const claims = decodeIdToken(idToken);
```

```ts
const response = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```

Make sure to add the `profile` scope to get the user profile and the `email` scope to get the user email.

```ts
const url = slack.createAuthorizationURL(state, codeVerifier);
url.addScopes("openid", "profile", "email");
```
