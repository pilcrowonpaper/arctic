---
title: "Kick"
---

# Kick

OAuth 2.0 provider for Kick.

Also see the [OAuth 2.0 with PKCE](/guides/oauth2-pkce) guide.

## Initialization

Pass the client secret for confidential clients.

```ts
import * as arctic from "arctic";

const kick = new arctic.Kick(clientId, clientSecret, redirectURI);
const kick = new arctic.Kick(clientId, null, redirectURI);
```

## Create authorization URL

```ts
import * as arctic from "arctic";

const state = arctic.generateState();
const codeVerifier = arctic.generateCodeVerifier();
const scopes = ["openid", "profile"];
const url = kick.createAuthorizationURL(state, codeVerifier, scopes);
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), [`UnexpectedResponseError`](/reference/main/UnexpectedResponseError), or [`UnexpectedErrorResponseBodyError`](/reference/main/UnexpectedErrorResponseBodyError). Kick returns an access token, the access token expiration, and a refresh token.

```ts
import * as arctic from "arctic";

try {
	const tokens = await kick.validateAuthorizationCode(code, codeVerifier);
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

Use `refreshAccessToken()` to get a new access token using a refresh token. Kick returns the same values as during the authorization code validation. This method also returns `OAuth2Tokens` and throws the same errors as `validateAuthorizationCode()`

```ts
import * as arctic from "arctic";

try {
	const tokens = await kick.refreshAccessToken(refreshToken);
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

### Get user profile

Add the `user:read` scope when creating the authorization URL.

```ts
const scopes = ["user:read"];
const url = kick.createAuthorizationURL(state, codeVerifier, scopes);
```

Then in your callback make a request to the Kick API.

```ts
const tokens = await kick.validateAuthorizationCode(code, codeVerifier);

const response = await fetch("https://api.kick.com/public/v1/users", {
	headers: {
		Authorization: `Bearer ${tokens.accessToken()}`
	}
});
const user = await response.json();
```

## Revoke tokens

Pass a token to `revokeToken()` to revoke all tokens associated with the authorization. This can throw the same errors as `validateAuthorizationCode()`.

```ts
try {
	await kick.revokeToken(refreshToken);
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
