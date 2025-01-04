---
title: "KeyCloak"
---

# KeyCloak

OAuth 2.0 provider for KeyCloak.

Also see the [OAuth 2.0 with PKCE](/guides/oauth2-pkce) guide.

## Initialization

Pass the client secret for confidential clients.

```ts
import * as arctic from "arctic";

const realmURL = "https://auth.example.com/realms/myrealm";
const keycloak = new arctic.KeyCloak(realmURL, clientId, clientSecret, redirectURI);
const keycloak = new arctic.KeyCloak(realmURL, clientId, null, redirectURI);
```

## Create authorization URL

```ts
import * as arctic from "arctic";

const state = arctic.generateState();
const codeVerifier = arctic.generateCodeVerifier();
const scopes = ["openid", "profile"];
const url = keycloak.createAuthorizationURL(state, codeVerifier, scopes);
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), [`UnexpectedResponseError`](/reference/main/UnexpectedResponseError), or [`UnexpectedErrorResponseBodyError`](/reference/main/UnexpectedErrorResponseBodyError). Actual values returned by KeyCloak depends on your configuration and version.

```ts
import * as arctic from "arctic";

try {
	const tokens = await keycloak.validateAuthorizationCode(code, codeVerifier);
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

The refresh token expiration is returned as `refresh_expires_in`.

```ts
const tokens = await keycloak.validateAuthorizationCode(code);
if ("refresh_expires_in" in tokens.data && typeof tokens.data.refresh_expires_in === "number") {
	const refreshTokenExpiresIn = tokens.data.refresh_expires_in;
}
```

## OpenID Connect

Use OpenID Connect with the `openid` scope to get the user's profile with an ID token or the `userinfo` endpoint. Arctic provides [`decodeIdToken()`](/reference/main/decodeIdToken) for decoding the token's payload.

```ts
const scopes = ["openid"];
const url = keycloak.createAuthorizationURL(state, codeVerifier, scopes);
```

```ts
import * as arctic from "arctic";

const tokens = await keycloak.validateAuthorizationCode(code, codeVerifier);
const idToken = tokens.idToken();
const claims = arctic.decodeIdToken(idToken);
```

## Refresh access tokens

Use `refreshAccessToken()` to get a new access token using a refresh token. This method also returns `OAuth2Tokens` and throws the same errors as `validateAuthorizationCode()`.

```ts
import * as arctic from "arctic";

try {
	const tokens = await keycloak.refreshAccessToken(refreshToken);
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

## Revoke tokens

Use `revokeToken()` to revoke a token. This can throw the same errors as `validateAuthorizationCode()`.

```ts
try {
	await keycloak.revokeToken(token);
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
