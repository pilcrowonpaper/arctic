---
title: "Slack (App)"
---

# Slack (App)

OAuth 2.0 provider for installing Slack apps. This is different from the OAuth provider used for "Sign in with Slack" - use [`Slack (OIDC)`](/providers/slack-oidc) instead.

Also see the [OAuth 2.0](/guides/oauth2) guide.

## Initialization

The redirect URI is optional.

```ts
import { SlackApp } from "arctic";

const slack = new SlackApp(clientId, clientSecret, null);
const slack = new SlackApp(clientId, clientSecret, redirectURI);
```

## Create authorization URL

Use `addScopes()` to define scopes.

```ts
import { generateState } from "arctic";

const state = generateState();
const url = slack.createAuthorizationURL(state);
url.addScopes("incoming-webhook", "commands");
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), or a standard `Error` (parse errors). Slack will only return an access token (no expiration)

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
