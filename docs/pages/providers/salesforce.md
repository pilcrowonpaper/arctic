---
title: "Salesforce"
---

# Salesforce

OAuth 2.0 provider for Salesforce.

Also see the [OAuth 2.0 with PKCE](/guides/oauth2-pkce) guide.

## Initialization

The `domain` parameter should not include paths or protocol.

```ts
import { Salesforce } from "arctic";

const domain = "login.salesforce.com";
const salesforce = new Salesforce(domain, clientId, clientSecret, redirectURI);
```

## Create authorization URL

Use `addScopes()` to define scopes.

```ts
import { generateState, generateCodeVerifier } from "arctic";

const state = generateState();
const codeVerifier = generateCodeVerifier();
const url = salesforce.createAuthorizationURL(state, codeVerifier);
url.addScopes("openid", "profile");
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), or a standard `Error` (parse errors). Salesforce only returns an access token.

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await salesforce.validateAuthorizationCode(code, codeVerifier);
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

## Refresh access tokens

Add the `refresh_token` scope to get refresh tokens.

```ts
const url = dropbox.createAuthorizationURL();
url.addScopes("refresh_token");
```

```ts
const tokens = await dropbox.validateAuthorizationCode(code);
const accessToken = tokens.accessToken();
const refreshToken = tokens.refreshToken();
```

Use `refreshAccessToken()` to get a new access token using a refresh token. Salesforce only returns an access token. This method also returns `OAuth2Tokens` and throws the same errors as `validateAuthorizationCode()`

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await salesforce.refreshAccessToken(accessToken);
	const accessToken = tokens.accessToken();
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
const url = roblox.createAuthorizationURL(state, codeVerifier);
url.addScopes("openid");
```

```ts
import { decodeIdToken } from "arctic";

const tokens = await roblox.validateAuthorizationCode(code, codeVerifier);
const idToken = tokens.idToken();
const claims = decodeIdToken(idToken);
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
const url = roblox.createAuthorizationURL(state, codeVerifier);
url.addScopes("openid", "profile", "email");
```

## Revoke tokens

Revoke tokens with `revokeToken()`. This can throw the same errors as `validateAuthorizationCode()`.

```ts
try {
	await salesforce.revokeToken(token);
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
