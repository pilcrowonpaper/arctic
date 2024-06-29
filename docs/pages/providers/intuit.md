---
title: "Intuit"
---

# Intuit

OAuth 2.0 provider for Intuit.

Also see the [OAuth 2.0](/guides/oauth2) guide.

## Initialization

```ts
import { Intuit } from "arctic";

const intuit = new Intuit(clientId, clientSecret, redirectURI);
```

## Create authorization URL

Use `addScopes()` to define scopes.

```ts
import { generateState } from "arctic";

const state = generateState();
const url = intuit.createAuthorizationURL(state);
url.addScopes("email", "activities.read");
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), or a standard `Error` (parse errors). Intuit returns an access token, the access token expiration, and a refresh token.

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await intuit.validateAuthorizationCode(code);
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

The refresh token expiration is returned as `x_refresh_token_expires_in`.

```ts
const tokens = await intuit.validateAuthorizationCode(code);
if (
	"x_refresh_token_expires_in" in tokens.data &&
	typeof tokens.data.x_refresh_token_expires_in === "number"
) {
	const refreshTokenExpiresIn = tokens.data.x_refresh_token_expires_in;
}
```

## OpenID Connect

Use OpenID Connect with the `openid` scope to get the user's profile with an ID token or the `userinfo` endpoint. Arctic provides [`decodeIdToken()`](/reference/main/decodeIdToken) for decoding the token's payload.

Also see [ID token claims](https://developer.intuit.com/app/developer/qbo/docs/develop/authentication-and-authorization/openid-connect#obtaining-user-profile-information).

```ts
const url = intuit.createAuthorizationURL(state);
url.addScopes("openid");
```

```ts
import { decodeIdToken } from "arctic";

const tokens = await intuit.validateAuthorizationCode(code);
const idToken = tokens.idToken();
const claims = decodeIdToken(idToken);
```

```ts
const response = await fetch("https://accounts.platform.intuit.com/v1/openid_connect/userinfo", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```

### Get user profile

Make sure to add the `profile` scope to get the user profile and the `email` scope to get the user email.

```ts
const url = intuit.createAuthorizationURL(state);
url.addScopes("openid", "profile", "email");
```

## Refresh access tokens

Use `refreshAccessToken()` to get a new access token using a refresh token. The returned values are the same as authorization code validation. This method also returns `OAuth2Tokens` and throws the same errors as `validateAuthorizationCode()`

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await intuit.refreshAccessToken(accessToken);
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

## Revoke tokens

Use `revokeToken()` to revoke a token. This can throw the same errors as `validateAuthorizationCode()`.

```ts
try {
	await intuit.revokeToken(token);
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
