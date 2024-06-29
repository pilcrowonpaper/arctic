---
title: "Microsoft Entra ID"
---

# Microsoft Entra ID

OAuth 2.0 provider for Microsoft Entra ID.

Also see the [OAuth 2.0](/guides/oauth2) guide.

## Initialization

See [Endpoints](https://learn.microsoft.com/en-us/entra/identity-platform/v2-protocols#endpoints) for more on the `tenant` parameter.

```ts
import { MicrosoftEntraId } from "arctic";

const entraId = new MicrosoftEntraId(tenant, clientId, clientSecret, redirectURI);
```

## Create authorization URL

Use `addScopes()` to define scopes.

```ts
import { generateState, generateCodeVerifier } from "arctic";

const state = generateState();
const codeVerifier = generateCodeVerifier();
const url = entraId.createAuthorizationURL(state, codeVerifier);
url.addScopes("openid", "profile");
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), or a standard `Error` (parse errors). Entra ID returns an access token, the access token expiration, and a refresh token.

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await entraId.validateAuthorizationCode(code, codeVerifier);
	const accessToken = tokens.accessToken();
	const accessTokenExpiresAt = tokens.accessTokenExpiresAt();
	const refreshToken = tokens.refreshToken();
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

Use `refreshAccessToken()` to get a new access token using a refresh token. Entra ID returns the same values as during the authorization code validation. This method also returns `OAuth2Tokens` and throws the same errors as `validateAuthorizationCode()`

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await entraId.refreshAccessToken(accessToken);
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

Use OpenID Connect with the `openid` scope to get the user's profile with an ID token or the `userinfo` endpoint. The `nonce` parameter is required by Entra ID to use OpenID. Arctic provides [`decodeIdToken()`](/reference/main/decodeIdToken) for decoding the token's payload.

```ts
const url = entraId.createAuthorizationURL(state, codeVerifier);
url.addScopes("openid");
// The nonce should be unique to each request similar to state.
// That said, nonce can just be "_" here since it isn't useful for server-based OAuth.
url.searchParams.set("nonce", nonce);
```

```ts
import { decodeIdToken } from "arctic";

const tokens = await entraId.validateAuthorizationCode(code, codeVerifier);
const idToken = tokens.idToken();
const claims = decodeIdToken(idToken);
```

```ts
const response = await fetch("https://graph.microsoft.com/oidc/userinfo", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```

### Get user profile

Make sure to add the `profile` scope to get the user profile and the `email` scope to get the user email.

```ts
const url = entraId.createAuthorizationURL(state, codeVerifier);
url.addScopes("openid", "profile", "email");
```
