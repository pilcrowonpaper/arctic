---
title: "Atlassian"
---

# Atlassian

OAuth 2.0 provider for Atlassian.

Also see the [OAuth 2.0](/guides/oauth2) guide.

## Initialization

```ts
import { Atlassian } from "arctic";

const atlassian = new Atlassian(clientId, clientSecret, redirectURI);
```

## Create authorization URL

Use `addScopes()` to define scopes.

```ts
import { generateState } from "arctic";

const state = generateState();
const url = atlassian.createAuthorizationURL(state);
url.addScopes("write:jira-work", "read:jira-user");
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), or a standard `Error` (parse errors). Atlassian returns an access token, the access token expiration, and a refresh token.

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await atlassian.validateAuthorizationCode(code);
	const accessToken = tokens.accessToken();
	const accessTokenExpiresAt = tokens.accessTokenExpiresAt();
	const refreshToken = tokens.refreshToken();
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

## Refresh access tokens

Use `refreshAccessToken()` to get a new access token using a refresh token. This method's behavior is identical to `validateAuthorizationCode()`.

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await atlassian.refreshAccessToken(accessToken);
	const accessToken = tokens.accessToken();
	const accessTokenExpiresAt = tokens.accessTokenExpiresAt();
	const refreshToken = tokens.refreshToken();
} catch (e) {
	if (e instanceof OAuth2RequestError) {
		// Invalid authorization code, credentials, or redirect URI
	}
	if (e instanceof ArcticFetchError) {
		// Failed to call `fetch()`
	}
	// Parse error
}
```

## Get user profile

Add the `read:me` scope and use the [`/me` endpoint](https://developer.atlassian.com/cloud/confluence/oauth-2-3lo-apps/#how-do-i-retrieve-the-public-profile-of-the-authenticated-user-).

```ts
const url = atlassian.createAuthorizationURL(state);
url.addScopes("read:me");
```

```ts
const response = await fetch("https://api.atlassian.com/me", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```
