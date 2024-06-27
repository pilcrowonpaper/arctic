---
title: "Google"
---

# Google

OAuth 2.0 authorization code provider for Google. Only supports confidential clients.

Also see [OAuth 2.0 with PKCE](/guides/oauth2-pkce).

## Initialization

`Google` takes a client ID, client secret, and redirect URI.

```ts
import { Google } from "arctic";

const google = new Google(clientId, clientSecret, redirectURI);
```

## Create authorization URL

Use `createAuthorizationURL()` to create a URL to redirect the user for authentication. You can set scopes with `setScopes()` and `appendScopes()`.

```ts
import { generateState, generateCodeVerifier } from "arctic";

const state = generateState();
const codeVerifier = generateCodeVerifier();
const url = google.createAuthorizationURL(state, codeVerifier);
url.setScopes("profile", "email");
```

## Validate authorization code

Use `validateAuthorizationCode()` to validate the provided authorization code. This will either return an [`OAuth2Tokens`]() or throw an error. Google only returns a refresh token on the user's first authentication so use `hasRefreshToken()` to check if a refresh token was provided.

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await google.validateAuthorizationCode(code);
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

## Refresh tokens

Set the `access_type` parameter to `offline` to get a refresh token. You will only get the refresh token on the user's first authentication.

```ts
const url = google.createAuthorizationURL();
url.searchParams.set("access_type", "offline");
```

```ts
const tokens = await google.validateAuthorizationCode();
const accessToken = tokens.accessToken();
const accessTokenExpiresAt = tokens.accessTokenExpiresAt();
if (tokens.hasRefreshToken()) {
	const refreshToken = tokens.refreshToken();
	const refreshTokenExpiresAt = tokens.refreshTokenExpiresAt();
}
```

Use `refreshAccessToken()` to get a new access token with a refresh token. This method's behavior is identical to `validateAuthorizationCode()`. Google will not provide a new refresh token.

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await github.refreshAccessToken(accessToken);
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

## OpenID Connect

Use OpenID Connect with the `openid` scope to get the user's profile with an ID token or the `userinfo` endpoint.

See [ID token claims](https://developers.google.com/identity/openid-connect/openid-connect#an-id-tokens-payload).

```ts
const url = google.createAuthorizationURL(state, codeVerifier);
url.setScopes("openid");
```

```ts
import { decodeIdToken } from "arctic";

const tokens = await google.validateAuthorizationCode(code);
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

Add the `profile` scope to include user profile in ID tokens and the `email` scope for the email.

```ts
const url = await google.createAuthorizationURL(state, codeVerifier, {
	scopes: ["profile", "email"]
});
```
