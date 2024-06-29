---
title: "Amazon Cognito"
---

# Amazon Cognito

OAuth 2.0 authorization code provider for Amazon Cognito.

Also see [OAuth 2.0 with PKCE](/guides/oauth2-pkce).

## Initialization

The user pool should not include trailing slashes.

```ts
import { AmazonCognito } from "arctic";

const userPool = "https://cognito-idp.{region}.amazonaws.com/{pool-id}";
const cognito = new AmazonCognito(userPool, clientId, clientSecret, redirectURI);
```

## Create authorization URL

Use `addScopes()` to define scopes.

```ts
import { generateState, generateCodeVerifier } from "arctic";

const state = generateState();
const codeVerifier = generateCodeVerifier();
const url = cognito.createAuthorizationURL(state, codeVerifier);
url.addScopes("openid", "profile");
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), or a standard `Error` (parse errors). Cognito returns an access token and refresh token alongside their expiration.

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await cognito.validateAuthorizationCode(code, codeVerifier);
	const accessToken = tokens.accessToken();
	const accessTokenExpiresAt = tokens.accessTokenExpiresAt();
	const refreshToken = tokens.refreshToken();
	const refreshTokenExpiresAt = tokens.refreshTokenExpiresAt();
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

Use `refreshAccessToken()` to get a new access token using a refresh token. This method's behavior is identical to `validateAuthorizationCode()`. Cognito will only return a new access token.

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await cognito.refreshAccessToken(accessToken);
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

Use OpenID Connect with the `openid` scope to get the user's profile with an ID token or the `userinfo` endpoint. Arctic provides [`decodeIdToken()`](/reference/main/decodeIdToken) for decoding the token's payload.

```ts
const url = cognito.createAuthorizationURL(state, codeVerifier);
url.addScopes("openid");
```

```ts
import { decodeIdToken } from "arctic";

const tokens = await cognito.validateAuthorizationCode(code, codeVerifier);
const idToken = tokens.idToken();
const claims = decodeIdToken(idToken);
```

```ts
const response = await fetch(userPool + "/oauth/userInfo", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```

### Get user profile

Make sure to add the `profile` scope to get the user profile and the `email` scope to get the user email.

```ts
const url = cognito.createAuthorizationURL(state, codeVerifier);
url.addScopes("openid", "profile", "email");
```

## Revoke tokens

Pass a token to `revokeToken()` to revoke all tokens associated with the authorization. This can throw the same errors as `validateAuthorizationCode()`.

```ts
try {
	await cognito.revokeToken(refreshToken);
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

> Token revocation must be enabled in the settings.
