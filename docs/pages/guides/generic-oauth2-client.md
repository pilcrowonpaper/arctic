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
import { OAuth2Client } from "arctic";

const client = new OAuth2Client(clientId, clientPassword, redirectURI);
```

## Create authorization URL

Use `OAuth2Client.createAuthorizationURL()` to create an authorization URL.

```ts
import { generateState } from "arctic";

const state = generateState();
const url = client.createAuthorizationURL(authorizationEndpoint, state, scopes);
```

For PKCE flows, use `OAuth2Client.createAuthorizationURLWithPKCE()`.

```ts
import { generateState, generateCodeVerifier, CodeChallengeMethod } from "arctic";

const state = generateState();
const codeVerifier = generateCodeVerifier();
const url = client.createAuthorizationURLWithPKCE(
	authorizationEndpoint,
	state,
	CodeChallengeMethod.S256,
	codeVerifier,
	scopes
);
```

## Validate authorization code

Use `OAuth2Client.validateAuthorizationCode()` to validate authorization codes. This returns an [`OAuth2Tokens`](/reference/main/OAuth2Tokens) instance, or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), or a standard `Error` (parse errors).

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await client.validateAuthorizationCode(tokenEndpoint, code, null);
	const accessToken = tokens.accessToken();
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

Pass the code verifier for PKCE.

```ts
const tokens = await client.validateAuthorizationCode(tokenEndpoint, code, codeVerifier);
```

## Refresh access token

Use `OAuth2Client.refreshAccessToken()` to refresh access tokens. This also returns an `OAuth2Tokens` instance and throws the same errors as `OAuth2Client.validateAuthorizationCode()`.

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await client.refreshAccessToken(tokenEndpoint, refreshToken, scopes);
	const accessToken = tokens.accessToken();
} catch (e) {
	if (e instanceof OAuth2RequestError) {
		// Invalid tokens, credentials, or redirect URI
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

## Revoke token

Use `OAuth2.revokeToken()` to revoke tokens. This also throws the same errors as `OAuth2Client.validateAuthorizationCode()`.

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	await client.revokeToken(tokenRevocationEndpoint, token);
} catch (e) {
	if (e instanceof OAuth2RequestError) {
		// Invalid tokens, credentials, or redirect URI
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
