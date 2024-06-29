---
title: "GitHub"
---

# GitHub

OAuth 2.0 provider for Github Apps and GitHub Apps.

Also see the [OAuth 2.0](/guides/oauth2) guide.

## Initialization

The redirect URI is optional but required by GitHub if there are multiple URIs defined.

```ts
import { GitHub } from "arctic";

const github = new GitHub(clientId, clientSecret, null);
const github = new GitHub(clientId, clientSecret, redirectURI);
```

## Create authorization URL

Use `addScopes()` to define scopes.

```ts
import { generateState } from "arctic";

const state = generateState();
const url = github.createAuthorizationURL(state);
url.addScopes("user:email", "repo");
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), or a standard `Error` (parse errors). OAuth Apps will only return an access token (no expiration).

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await github.validateAuthorizationCode(code);
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

If you're using GitHub Apps, GitHub will provide an expiration for the access token alongside a refresh token.

```ts
const tokens = await github.validateAuthorizationCode(code);
const accessToken = tokens.accessToken();
const accessTokenExpiresAt = tokens.accessTokenExpiresAt();
const refreshToken = tokens.refreshToken();
const refreshTokenExpiresAt = tokens.refreshTokenExpiresAt();
```

## Refresh access tokens

For GitHub Apps, use `refreshAccessToken()` to get a new access token using a refresh token. The behavior is identical to `validateAuthorizationCode()`.

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await github.refreshAccessToken(accessToken);
	const accessToken = tokens.accessToken();
	const accessTokenExpiresAt = tokens.accessTokenExpiresAt();
	const refreshToken = tokens.refreshToken();
	const refreshTokenExpiresAt = tokens.refreshTokenExpiresAt();
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
const url = github.createAuthorizationURL(state);
url.addScopes("user:email");
```

```ts
const tokens = await github.validateAuthorizationCode(code);
const response = await fetch("https://api.github.com/user/emails", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const emails = await response.json();
```
