---
title: "Generic OAuth 2.0 client"
---

# Generic OAuth 2.0 client

Arctic provides a generic client for OAuth 2.0 authorization code flow based on [RFC 6749](https://datatracker.ietf.org/doc/html/rfc6749), [RFC 7009](https://datatracker.ietf.org/doc/html/rfc7009), and [RFC 7636](https://datatracker.ietf.org/doc/html/rfc7636). Please be aware that the client strictly follows the RFCs and may not work with providers that aren't spec-compliant. Some common non-compliant behaviors are:

- Does not support HTTP Basic Authentication scheme for client authentication.
- Returns non-400 status codes for errors.
- Returns custom error JSON response body.

Only client password authentication is supported.

## Initialization

Initialize `OAuth2Client` with your client ID, client password (secret), and redirect URI. `clientSecret` and `redirectURI` can be `null`.

```ts
import * as arctic from "arctic";

const client = new arctic.OAuth2Client(clientId, clientPassword, redirectURI);
```

## Create authorization URL

Use `OAuth2Client.createAuthorizationURL()` to create an authorization URL.

```ts
import * as arctic from "arctic";

const state = arctic.generateState();
const url = client.createAuthorizationURL(authorizationEndpoint, state, scopes);
```

For PKCE flows, use `OAuth2Client.createAuthorizationURLWithPKCE()`.

```ts
import * as arctic from "arctic";

const state = arctic.generateState();
const codeVerifier = arctic.generateCodeVerifier();
const url = client.createAuthorizationURLWithPKCE(
	authorizationEndpoint,
	state,
	arctic.CodeChallengeMethod.S256,
	codeVerifier,
	scopes
);
```

## Validate authorization code

Use `OAuth2Client.validateAuthorizationCode()` to validate authorization codes. This returns an [`OAuth2Tokens`](/reference/main/OAuth2Tokens) instance, or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), [`UnexpectedResponseError`](/reference/main/UnexpectedResponseError), or [`UnexpectedErrorResponseBodyError`](/reference/main/UnexpectedErrorResponseBodyError).

```ts
import * as arctic from "arctic";

try {
	const tokens = await client.validateAuthorizationCode(tokenEndpoint, code, null);
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

Pass the code verifier for PKCE.

```ts
const tokens = await client.validateAuthorizationCode(tokenEndpoint, code, codeVerifier);
```

## Refresh access token

Use `OAuth2Client.refreshAccessToken()` to refresh access tokens. This also returns an `OAuth2Tokens` instance and throws the same errors as `OAuth2Client.validateAuthorizationCode()`.

```ts
import * as arctic from "arctic";

try {
	// Pass an empty `scopes` array to keep using the same scopes.
	const tokens = await client.refreshAccessToken(tokenEndpoint, refreshToken, scopes);
	const accessToken = tokens.accessToken();
} catch (e) {
	if (e instanceof arctic.OAuth2RequestError) {
		// Invalid tokens, credentials, or redirect URI
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

## Revoke token

Use `OAuth2.revokeToken()` to revoke tokens. This also throws the same errors as `OAuth2Client.validateAuthorizationCode()`.

```ts
import * as arctic from "arctic";

try {
	await client.revokeToken(tokenRevocationEndpoint, token);
} catch (e) {
	if (e instanceof arctic.OAuth2RequestError) {
		// Invalid tokens, credentials, or redirect URI
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
