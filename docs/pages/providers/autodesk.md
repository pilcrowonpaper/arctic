---
title: "Autodesk Platform Services"
---

# Autodesk Platform Services

OAuth 2.0 provider for Autodesk Platform Services. See the [Authentication (OAuth)](https://aps.autodesk.com/en/docs/oauth/v2/developers_guide/overview/) documentation for more information about the API.

Also see the [OAuth 2.0 with PKCE](/guides/oauth2-pkce) guide.

## Initialization

Pass the client secret for confidential clients.

```ts
import * as arctic from "arctic";

const autodesk = new arctic.Autodesk(clientId, clientSecret, redirectURI);
const autodesk = new arctic.Autodesk(clientId, null, redirectURI);
```

## Create authorization URL

```ts
import * as arctic from "arctic";

const state = arctic.generateState();
const codeVerifier = arctic.generateCodeVerifier();
const scopes = ["openid", "user:read", "data:read"];
const url = autodesk.createAuthorizationURL(state, codeVerifier, scopes);
```

The list of scopes Autodesk Platform Services supports can be found at the [Developer's Guide/Scopes](https://aps.autodesk.com/en/docs/oauth/v2/developers_guide/scopes/) page.

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), [`UnexpectedResponseError`](/reference/main/UnexpectedResponseError), or [`UnexpectedErrorResponseBodyError`](/reference/main/UnexpectedErrorResponseBodyError). Autodesk Platform Services returns an access token, the access token expiration, and a refresh token.

```ts
import * as arctic from "arctic";

try {
	const tokens = await autodesk.validateAuthorizationCode(code, codeVerifier);
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

Use `refreshAccessToken()` to get a new access token using a refresh token. Autodesk Platform Services returns the same values as during the authorization code validation. This method also returns `OAuth2Tokens` and throws the same errors as `validateAuthorizationCode()`

```ts
import * as arctic from "arctic";

try {
	// Pass an empty `scopes` array to keep using the same scopes.
	const tokens = await autodesk.refreshAccessToken(refreshToken, scopes);
	const accessToken = tokens.accessToken();
	const accessTokenExpiresAt = tokens.accessTokenExpiresAt();
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

Use `revokeToken()` to revoke a token. You need to specify wether the token is an `access_token` or a `refresh_token`. This can throw the same errors as `validateAuthorizationCode()`.

```ts
try {
	await autodesk.revokeToken(token, token_type);
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

## OpenID Connect

Use OpenID Connect with the `openid` scope to get an `idToken`.

```ts
const scopes = ["openid"];
const url = autodesk.createAuthorizationURL(state, codeVerifier, scopes);
```

Arctic provides [`decodeIdToken()`](/reference/main/decodeIdToken) for decoding the token's payload.

```ts
import * as arctic from "arctic";

const tokens = await autodesk.validateAuthorizationCode(code, codeVerifier);
const idToken = tokens.idToken();
const claims = arctic.decodeIdToken(idToken);
```

## Get user information

Get the user information by using the [`https://api.userprofile.autodesk.com/userinfo` endpoint](https://aps.autodesk.com/en/docs/profile/v1/reference/profile/oidcuserinfo/).

```ts
const response = await fetch("https://api.userprofile.autodesk.com/userinfo", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```
