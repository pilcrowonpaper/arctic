---
title: "GitLab"
---

# GitLab

OAuth 2.0 provider for GitLab.

Also see the [OAuth 2.0](/guides/oauth2) guide.

## Initialization

The `domain` parameter should not include the protocol or path. Use `gitlab.com` for GitLab.com.

```ts
import { GitLab } from "arctic";

const gitlab = new GitLab("gitlab.com", clientId, clientSecret, redirectURI);
const gitlab = new GitLab(domain, clientId, clientSecret, redirectURI);
```

## Create authorization URL

Use `addScopes()` to define scopes.

```ts
import { generateState } from "arctic";

const state = generateState();
const url = gitlab.createAuthorizationURL(state);
url.addScopes("read_user", "profile");
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), or a standard `Error` (parse errors). GitLab returns an access token, the access token expiration, and a refresh token.

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await gitlab.validateAuthorizationCode(code);
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
	const tokens = await gitlab.refreshAccessToken(accessToken);
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

Add the `read_user` scope and use the [`/user` endpoint](https://docs.gitlab.com/ee/api/users.html#list-current-user).

```ts
const url = gitlab.createAuthorizationURL(state);
url.addScopes("read_user");
```

```ts
const response = await fetch("https://gitlab.com/api/v4/user", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```

## Revoke tokens

Use `revokeToken()` to revoke a token. This can throw the same errors as `validateAuthorizationCode()`.

```ts
try {
	await gitlab.revokeToken(token);
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
