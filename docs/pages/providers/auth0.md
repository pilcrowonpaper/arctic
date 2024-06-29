---
title: "Auth0"
---

# Auth0

OAuth 2.0 provider for Auth0.

Also see the [OAuth 2.0](/guides/oauth2) guide.

## Initialization

The domain should not include the protocol or path.

```ts
import { Auth0 } from "arctic";

const domain = "xxx.auth0.com";
const auth0 = new Auth0(domain, clientId, clientSecret, redirectURI);
```

## Create authorization URL

Use `addScopes()` to define scopes.

```ts
import { generateState } from "arctic";

const state = generateState();
const url = auth0.createAuthorizationURL(state);
url.addScopes("openid", "profile");
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), or a standard `Error` (parse errors). Auth0 returns an access token, the access token expiration, and a refresh token.

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await auth0.validateAuthorizationCode(code);
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

Use `refreshAccessToken()` to get a new access token using a refresh token. Auth0 returns the same values as during the authorization code validation. This method also returns `OAuth2Tokens` and throws the same errors as `validateAuthorizationCode()`

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await auth0.refreshAccessToken(accessToken);
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

## OpenID Connect

Use OpenID Connect with the `openid` scope to get the user's profile with an ID token or the `userinfo` endpoint. Arctic provides [`decodeIdToken()`](/reference/main/decodeIdToken) for decoding the token's payload.

```ts
const url = auth0.createAuthorizationURL(state, codeVerifier);
url.addScopes("openid");
```

```ts
import { decodeIdToken } from "arctic";

const tokens = await auth0.validateAuthorizationCode(code, codeVerifier);
const idToken = tokens.idToken();
const claims = decodeIdToken(idToken);
```

```ts
const response = await fetch("https://xxx.auth.com/userinfo", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```

### Get user profile

Make sure to add the `profile` scope to get the user profile and the `email` scope to get the user email.

```ts
const url = auth0.createAuthorizationURL(state, codeVerifier);
url.addScopes("openid", "profile", "email");
```

## Revoke tokens

Revoke tokens with `revokeToken()`. Currently, only refresh tokens can be revoked. It throws the same errors as `validateAuthorizationCode()`.

```ts
try {
	await box.revokeToken(refreshToken);
} catch (e) {
	// Handle errors
}
```
