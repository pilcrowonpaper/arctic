---
title: "Gitea"
---

# Gitea

OAuth 2.0 provider for Gitea.

Also see the [OAuth 2.0](/guides/oauth2) guide.

Read the Gitea OAuth2 Provider docs [Here](https://docs.gitea.com/development/oauth2-provider).

## Initialization

The `baseURL` parameter is the full URL where the Gitea instance is hosted. Use `https://gitea.com` for managed servers. Pass the client secret for confidential clients.

```ts
import * as arctic from "arctic";

const baseURL = "https://gitea.com";
const baseURL = "https://my-app.com/gitea";
const gitea = new arctic.gitea(baseURL, clientId, clientSecret, redirectURI);
const gitea = new arctic.gitea(baseURL, clientId, null, redirectURI);
```

## Create authorization URL

```ts
import * as arctic from "arctic";

const state = arctic.generateState();
const scopes = ["read:user", "write:notification"];
const url = gitea.createAuthorizationURL(state, scopes);
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), [`UnexpectedResponseError`](/reference/main/UnexpectedResponseError), or [`UnexpectedErrorResponseBodyError`](/reference/main/UnexpectedErrorResponseBodyError). gitea returns an access token, the access token expiration, and a refresh token.

```ts
import * as arctic from "arctic";

try {
	const tokens = await gitea.validateAuthorizationCode(code);
	const accessToken = tokens.accessToken();
	const accessTokenExpiresAt = tokens.accessTokenExpiresAt();
	const refreshToken = tokens.refreshToken();
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

## Refresh access tokens

Use `refreshAccessToken()` to get a new access token using a refresh token. This method's behavior is identical to `validateAuthorizationCode()`.

```ts
import * as arctic from "arctic";

try {
	const tokens = await gitea.refreshAccessToken(refreshToken);
	const accessToken = tokens.accessToken();
	const accessTokenExpiresAt = tokens.accessTokenExpiresAt();
	const refreshToken = tokens.refreshToken();
} catch (e) {
	if (e instanceof arctic.OAuth2RequestError) {
		// Invalid authorization code, credentials, or redirect URI
	}
	if (e instanceof arctic.ArcticFetchError) {
		// Failed to call `fetch()`
	}
	// Parse error
}
```

## Get user profile

Add the `read:user` scope and [`Gitea oauth docs`](https://gitea.com/api/swagger#/user).

```ts
const scopes = ["read:user"];
const url = gitea.createAuthorizationURL(state, scopes);
```

```ts
const response = await fetch("https://gitea.com/user", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```

## Note

For historical reasons, Gitea needs the word token included before the API key token in an authorization header, like this:

Authorization: token 65eaa9c8ef52460d22a93307fe0aee76289dc675