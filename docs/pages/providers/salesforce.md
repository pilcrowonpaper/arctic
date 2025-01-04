---
title: "Salesforce"
---

# Salesforce

OAuth 2.0 provider for Salesforce.

Also see the [OAuth 2.0 with PKCE](/guides/oauth2-pkce) guide.

## Initialization

The `domain` parameter should not include paths or protocol. Pass the client secret for confidential clients.

```ts
import * as arctic from "arctic";

const domain = "login.salesforce.com";
const salesforce = new arctic.Salesforce(domain, clientId, clientSecret, redirectURI);
const salesforce = new arctic.Salesforce(domain, clientId, null, redirectURI);
```

## Create authorization URL

```ts
import * as arctic from "arctic";

const state = arctic.generateState();
const codeVerifier = arctic.generateCodeVerifier();
const scopes = ["openid", "profile"];
const url = salesforce.createAuthorizationURL(state, codeVerifier, scopes);
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), [`UnexpectedResponseError`](/reference/main/UnexpectedResponseError), or [`UnexpectedErrorResponseBodyError`](/reference/main/UnexpectedErrorResponseBodyError). Salesforce only returns an access token.

```ts
import * as arctic from "arctic";

try {
	const tokens = await salesforce.validateAuthorizationCode(code, codeVerifier);
	const accessToken = tokens.accessToken();
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

Add the `refresh_token` scope to get refresh tokens.

```ts
const scopes = ["refresh_token"];
const url = salesforce.createAuthorizationURL(state, codeVerifier, scopes);
```

```ts
const tokens = await salesforce.validateAuthorizationCode(code);
const accessToken = tokens.accessToken();
const refreshToken = tokens.refreshToken();
```

Use `refreshAccessToken()` to get a new access token using a refresh token. Salesforce only returns an access token. This method also returns `OAuth2Tokens` and throws the same errors as `validateAuthorizationCode()`

```ts
import * as arctic from "arctic";

try {
	const tokens = await salesforce.refreshAccessToken(refreshToken);
	const accessToken = tokens.accessToken();
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

Use OpenID Connect with the `openid` scope to get the user's profile with an ID token or the `userinfo` endpoint. Arctic provides [`decodeIdToken()`](/reference/main/decodeIdToken) for decoding the token's payload.

```ts
const scopes = ["openid"];
const url = salesforce.createAuthorizationURL(state, codeVerifier, scopes);
```

```ts
import * as arctic from "arctic";

const tokens = await salesforce.validateAuthorizationCode(code, codeVerifier);
const idToken = tokens.idToken();
const claims = arctic.decodeIdToken(idToken);
```

```ts
const response = await fetch("https://login.salesforce.com/services/oauth2/userinfo", {
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
const url = salesforce.createAuthorizationURL(state, codeVerifier, scopes);
```

## Revoke tokens

Revoke tokens with `revokeToken()`. This can throw the same errors as `validateAuthorizationCode()`.

```ts
try {
	await salesforce.revokeToken(token);
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
