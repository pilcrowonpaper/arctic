---
title: "GitHub"
---

# GitHub

OAuth 2.0 provider for GitHub Apps and OAuth Apps.

Also see the [OAuth 2.0](/guides/oauth2) guide.

## Initialization

The redirect URI is optional but required by GitHub if there are multiple URIs defined.

```ts
import * as arctic from "arctic";

const github = new arctic.GitHub(clientId, clientSecret, null);
const github = new arctic.GitHub(clientId, clientSecret, redirectURI);
```

## Create authorization URL

```ts
import * as arctic from "arctic";

const state = arctic.generateState();
const scopes = ["user:email", "repo"];
const url = github.createAuthorizationURL(state, scopes);
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), [`UnexpectedResponseError`](/reference/main/UnexpectedResponseError), or [`UnexpectedErrorResponseBodyError`](/reference/main/UnexpectedErrorResponseBodyError). OAuth Apps will only return an access token (no expiration).

```ts
import * as arctic from "arctic";

try {
	const tokens = await github.validateAuthorizationCode(code);
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

If you're using GitHub Apps, GitHub will provide an expiration for the access token alongside a refresh token.

```ts
const tokens = await github.validateAuthorizationCode(code);
const accessToken = tokens.accessToken();
const accessTokenExpiresAt = tokens.accessTokenExpiresAt();
const refreshToken = tokens.refreshToken();
```

The refresh token expiration is returned as `refresh_token_expires_in`.

```ts
const tokens = await github.validateAuthorizationCode(code);
if (
	"refresh_token_expires_in" in tokens.data &&
	typeof tokens.data.refresh_token_expires_in === "number"
) {
	const refreshTokenExpiresIn = tokens.data.refresh_token_expires_in;
}
```

## Refresh access tokens

For GitHub Apps, use `refreshAccessToken()` to get a new access token using a refresh token. The behavior is identical to `validateAuthorizationCode()`.

```ts
import * as arctic from "arctic";

try {
	const tokens = await github.refreshAccessToken(refreshToken);
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

Use the [`/user` endpoint](https://docs.github.com/en/rest/users/users?apiVersion=2022-11-28#get-the-authenticated-user).

```ts
const response = await fetch("https://api.github.com/user", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```

## Get user email

Add the `email` scope and use the [`/user/emails` endpoint](https://docs.github.com/en/rest/users/emails?apiVersion=2022-11-28#list-email-addresses-for-the-authenticated-user).

```ts
const scopes = ["user:email"];
const url = github.createAuthorizationURL(state, scopes);
```

```ts
const response = await fetch("https://api.github.com/user/emails", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const emails = await response.json();
```
