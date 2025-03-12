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

const autodesk = new arctic.Autodesk(tenant, clientId, clientSecret, redirectURI);
const autodesk = new arctic.Autodesk(tenant, clientId, null, redirectURI);
```

## Create authorization URL
```ts
import * as arctic from "arctic";

const state = arctic.generateState();
const codeVerifier = arctic.generateCodeVerifier();
const scopes = ["openid", "profile"];
const url = entraId.createAuthorizationURL(state, codeVerifier, scopes);
```

The list of optional scopes can be found at the [Developer's Guide/Scopes](https://aps.autodesk.com/en/docs/oauth/v2/developers_guide/scopes/) page.

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), [`UnexpectedResponseError`](/reference/main/UnexpectedResponseError), or [`UnexpectedErrorResponseBodyError`](/reference/main/UnexpectedErrorResponseBodyError). Autodesk Platform Services returns an access token, the access token expiration, and a refresh token.

```ts
import * as arctic from "arctic";

try {
	const tokens = await entraId.validateAuthorizationCode(code, codeVerifier);
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
	const tokens = await entraId.refreshAccessToken(refreshToken, scopes);
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

## OpenID Connect

Use OpenID Connect with the `openid` scope to get the user's profile with an ID token or the `userinfo` endpoint. The `nonce` parameter is required by Autodesk Platform Services to use OpenID. Arctic provides [`decodeIdToken()`](/reference/main/decodeIdToken) for decoding the token's payload.

```ts
const scopes = ["openid"];
const url = entraId.createAuthorizationURL(state, codeVerifier, scopes);
// The nonce should be unique to each request similar to state.
// However, nonce can just be "_" here since it isn't useful for server-based OAuth.
url.searchParams.set("nonce", nonce);
```

```ts
import * as arctic from "arctic";

const tokens = await entraId.validateAuthorizationCode(code, codeVerifier);
const idToken = tokens.idToken();
const claims = arctic.decodeIdToken(idToken);
```

```ts
const response = await fetch("https://api.userprofile.autodesk.com/userinfo", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```

### Get user profile

Make sure to add the `profile` scope to get the user profile and the `email` scope to get the user email.

```ts
const scopes = ["openid", "profile", "email"];
const url = entraId.createAuthorizationURL(state, codeVerifier, scopes);
```
