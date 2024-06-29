---
title: "Migrate to v2"
---

# Migrate to v2

Arctic v2 is here! This update changes how tokens are handled and introduces various small improvements. Behind the scenes, it's also fully type-safe now! We used to heavily rely on type assertion but this upgrade adds proper `in` and `typeof` checks!

```
npm install arctic@next
```

> All providers except KeyCloak has been migrated. If you use keyCloak, please help us with the migration!

## Authorization URL

`createAuthorizationURL()` is no longer asynchronous. There is no longer a `scopes` option as well. Instead, use the `addScopes()` method.

```ts
const url = github.createAuthorizationURL(state);
url.addScopes("user:email", "repo");
```

## Authorization code validation

`validateAuthorizationCode()` returns an [`OAuth2Token`](/reference/main/OAuth2Token) instead of a simple object. To get the access token, call the `accessToken()` method. These methods will throw an error if the field doesn't exist.

```ts
const tokens = await github.validateAuthorizationCode(code);
const accessToken = tokens.accessToken();
const accessTokenExpiresAt = tokens.accessTokenExpiresAt();
const refreshToken = tokens.refreshToken();
const refreshTokenExpiresAt = tokens.refreshTokenExpiresAt();
const idToken = tokens.idToken();
```

Use `hasRefreshToken()` to check if the `refresh_token` field exists.

```ts
if (tokens.hasRefreshToken()) {
	const refreshToken = tokens.refreshToken();
	const refreshTokenExpiresAt = tokens.refreshTokenExpiresAt();
}
```

`validateAuthorizationCode()` throws one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), or `Error`.

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await github.validateAuthorizationCode(code);
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

## OpenID Connect

Providers no longer include the `openid` scope by default.

```ts
const url = google.createAuthorizationURL(state, codeVerifier);
url.addScopes("openid", "profile");
```

## Initialization

The initialization parameters have changed for a few providers. See each provider's guide for details.

- [Apple](/providers/apple)
- [Github](/provders/github)
- [GitLab](/providers/gitlab)
- [Microsoft Entra ID](/providers/microsoft-entra-id)
- [MyAnimeList](/providers/myanimelist)
- [Okta](/providers/okta)
- [osu!](/providers/osu)
- [Salesforce](/providers/salesforce)

## Token revocation

Token revocation API has been added for providers that support it.

```ts
await google.revokeToken(token);
```
