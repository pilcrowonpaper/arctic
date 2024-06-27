---
title: "Slack"
---

# Slack

OAuth 2.0 provider for Slack.

Also see the [OAuth 2.0](/guides/oauth2) guide.

## Initialization

```ts
import { Slack } from "arctic";

const slack = new Slack(clientId, clientSecret, redirectURI);
```

## Create authorization URL

Use `setScopes()` and `appendScopes()` to define scopes.

```ts
import { generateState } from "arctic";

const state = generateState();
const url = slack.createAuthorizationURL(state);
url.setScopes("email", "users.profile:write");
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/OAuth2RequestError), [`ArcticFetchError`](/reference/ArcticFetchError), or a standard `Error` (parse errors). Slack will only return an access token (no expiration)

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await slack.validateAuthorizationCode(code);
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

## OpenID Connect

Use OpenID Connect with the `openid` scope to get the user's profile with an ID token or the `userinfo` endpoint. Arctic provides [`decodeIdToken()`](/reference/decodeIdToken) for decoding the token's payload.

Also see [example ID token claims](https://api.slack.com/authentication/sign-in-with-slack#response).

```ts
const url = slack.createAuthorizationURL(state, codeVerifier);
url.setScopes("openid");
```

```ts
import { decodeIdToken } from "arctic";

const tokens = await slack.validateAuthorizationCode(code);
const idToken = tokens.idToken();
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
url.setScopes("profile", "email");
```
