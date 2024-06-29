---
title: "Google"
---

# Google

OAuth 2.0 authorization code provider for Google. Only supports confidential clients.

Also see [OAuth 2.0 with PKCE](/guides/oauth2-pkce).

## Initialization

```ts
import { Google } from "arctic";

const google = new Google(clientId, clientSecret, redirectURI);
```

## Create authorization URL

Use `addScopes()` to define scopes.

```ts
import { generateState, generateCodeVerifier } from "arctic";

const state = generateState();
const codeVerifier = generateCodeVerifier();
const url = google.createAuthorizationURL(state, codeVerifier);
url.addScopes("openid", "profile");
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), or a standard `Error` (parse errors). Google will return an access token with an expiration.

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await google.validateAuthorizationCode(code, codeVerifier);
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

Also see [ID token claims](https://developers.google.com/identity/openid-connect/openid-connect#an-id-tokens-payload).

```ts
const url = google.createAuthorizationURL(state, codeVerifier);
url.addScopes("openid");
```

```ts
import { decodeIdToken } from "arctic";

const tokens = await google.validateAuthorizationCode(code, codeVerifier);
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

### Get user profile

Make sure to add the `profile` scope to get the user profile and the `email` scope to get the user email.

```ts
const url = google.createAuthorizationURL(state, codeVerifier);
url.addScopes("openid", "profile", "email");
```

## Refresh tokens

Set the `access_type` parameter to `offline` to get refresh tokens. You will only get the refresh token on the user's first authentication.

```ts
const url = google.createAuthorizationURL();
url.searchParams.set("access_type", "offline");
```

```ts
const tokens = await google.validateAuthorizationCode(code, codeVerifier);
const accessToken = tokens.accessToken();
const accessTokenExpiresAt = tokens.accessTokenExpiresAt();
if (tokens.hasRefreshToken()) {
	const refreshToken = tokens.refreshToken();
	const refreshTokenExpiresAt = tokens.refreshTokenExpiresAt();
}
```

Use `refreshAccessToken()` to get a new access token using a refresh token. This method's behavior is identical to `validateAuthorizationCode()`. Google will not provide a new refresh token after a token refresh.

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await google.refreshAccessToken(accessToken);
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

Revoke tokens with `revokeToken()`. This can throw the same errors as `validateAuthorizationCode()`.

```ts
try {
	await google.revokeToken(token);
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
