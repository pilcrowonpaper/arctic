---
title: "Zitadel"
---

# Zitadel

OAuth 2.0 provider for Zitadel.

Also see the [Authenticate users with OpenID Connect](https://zitadel.com/docs/guides/integrate/login/oidc) (OIDC) guide.

## Initialization

After creating a project and a client, get the domain of your instance (if using Zitadel cloud) or your self-hosted deployment.

The variable should include protocol (`http`, `https`) just in case you're using something like a local docker-compose instance. Please don't use `http` in production.

The Zitadel provider is designed to be used in a server-side environment, with a configuration of a client that has Authentication as None. This is the recommended configuration for Zitadel web applications and backends. As a result, no secret client is required for the flows supported by the provider.

```ts
import { Zitadel } from "arctic";

const domain = "https://xxxxxx.us1.zitadel.cloud";
const zitadel = new Zitadel(domain, clientId, redirectURI);
```

## Create authorization URL

```ts
import { generateState } from "arctic";

const state = arctic.generateState();
const codeVerifier = arctic.generateCodeVerifier();
const scopes = [
	// if you want the profile in the id token
	"openid",
	"profile",
	"email",
	// Required to get refresh token back in the response
	"offline_access", 
	// required if you're going to use any other API endpoint
	// for example: /auth/v1/users/me to get full user's profile
	"urn:zitadel:iam:org:project:id:zitadel:aud", 
];
const authorizationUrl = zitadel.createAuthorizationURL(
	state,
	codeVerifier,
	scopes,
);
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), or a standard `Error` (parse errors). Zitadel returns an access token, the access token expiration, and a refresh token if you specified the `offline_access` scope.

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await zitadel.validateAuthorizationCode(code);
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

Use `refreshAccessToken()` to get a new access token using a refresh token. Zitadel returns the same values as during the authorization code validation. This method also returns `OAuth2Tokens` and throws the same errors as `validateAuthorizationCode()`

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await zitadel.refreshAccessToken(refreshToken);
	const accessToken = tokens.accessToken();
	const accessTokenExpiresAt = tokens.accessTokenExpiresAt();
	const refreshToken = tokens.refreshToken();
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
const scopes = ["openid"];
const url = zitadel.createAuthorizationURL(state, codeVerifier, scopes);
```

```ts
import { decodeIdToken } from "arctic";

const tokens = await zitadel.validateAuthorizationCode(code, codeVerifier);
const idToken = tokens.idToken();
const claims = decodeIdToken(idToken);
```

### Get user profile

With the right scopes, you can then fetch the user profile like this:

```ts
const profileResponse = await fetch(
	`${env.ZITADEL_URL}/auth/v1/users/me`,
	{
		headers: {
			Accept: "application/json",
			Authorization: `Bearer ${tokens.accessToken()}`,
		},
	},
);
```

## Revoke tokens

Revoke tokens with `revokeToken()`. You should be able to revoke both the refresh and access token. It throws the same errors as `validateAuthorizationCode()`.

```ts
try {
	await box.revokeToken(refreshToken);
} catch (e) {
	// Handle errors
}
```
