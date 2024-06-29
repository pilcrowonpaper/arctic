---
title: "Dropbox"
---

# Dropbox

OAuth 2.0 provider for Dropbox.

Also see the [OAuth 2.0](/guides/oauth2) guide.

## Initialization

```ts
import { Dropbox } from "arctic";

const dropbox = new Dropbox(clientId, clientSecret, redirectURI);
```

## Create authorization URL

Use `addScopes()` to define scopes.

```ts
import { generateState } from "arctic";

const state = generateState();
const url = dropbox.createAuthorizationURL(state);
url.addScopes("account_info.read", "files.content.read");
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), or a standard `Error` (parse errors). Dropbox returns an access token and its expiration.

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await dropbox.validateAuthorizationCode(code);
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

## OpenID Connect

Use OpenID Connect with the `openid` scope to get the user's profile with an ID token or the `userinfo` endpoint. Arctic provides [`decodeIdToken()`](/reference/main/decodeIdToken) for decoding the token's payload.

Also see [supported claims](https://developers.dropbox.com/oidc-guide#oidc-standard).

```ts
const url = dropbox.createAuthorizationURL(state, codeVerifier);
url.addScopes("openid");
```

```ts
import { decodeIdToken } from "arctic";

const tokens = await dropbox.validateAuthorizationCode(code, codeVerifier);
const idToken = tokens.idToken();
const claims = decodeIdToken(idToken);
```

```ts
const response = await fetch("https://api.dropboxapi.com/2/openid/userinfo", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```

### Get user profile

Make sure to add the `profile` scope to get the user profile and the `email` scope to get the user email.

```ts
const url = google.createAuthorizationURL(state, codeVerifier);
url.addScopes("openid", "profile", "email");
```

The [`/users/get_current_account` endpoint](https://www.dropbox.com/developers/documentation/http/documentation#users-get_current_account) can also be used.

## Refresh access tokens

Set the `access_type` parameter to `offline` to get refresh tokens.

```ts
const url = dropbox.createAuthorizationURL();
url.searchParams.set("access_type", "offline");
```

```ts
const tokens = await dropbox.validateAuthorizationCode(code);
const accessToken = tokens.accessToken();
const accessTokenExpiresAt = tokens.accessTokenExpiresAt();
const refreshToken = tokens.refreshToken();
```

Use `refreshAccessToken()` to get a new access token using a refresh token. Dropbox will only return the access token and its expiration. This method also returns `OAuth2Tokens` and throws the same errors as `validateAuthorizationCode()`

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await dropbox.refreshAccessToken(accessToken);
	const accessToken = tokens.accessToken();
	const accessTokenExpiresAt = tokens.accessTokenExpiresAt();
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

## Revoke tokens

Pass a token to `revokeToken()` to revoke all tokens associated with the authorization (in other words, both tokens will be revoked regardless of which one you passed). This can throw the same errors as `validateAuthorizationCode()`.

```ts
try {
	await dropbox.revokeToken(token);
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
