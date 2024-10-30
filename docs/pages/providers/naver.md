---
title: "Naver"
---

# Naver

OAuth 2.0 provider for Naver.

Also see the [OAuth 2.0](/guides/oauth2) guide.

## Initialization

```ts
import { Naver } from "arctic";

const naver = new Naver(clientId, clientSecret, redirectURI);
```

## Create authorization URL

```ts
const url = naver.createAuthorizationURL();
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), or a standard `Error` (parse errors). Naver returns an access token and a refresh token.

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await naver.validateAuthorizationCode(code);

	const accessToken = tokens.accessToken();
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

It also returns the access token expiration, but does so in a non-RFC compliant manner. This is a known issue with Naver.

```ts
const tokens = await bungie.validateAuthorizationCode(code);
// Should be returned as a number per RFC 6749, but returns it as a string.
if ("expires_in" in tokens.data && typeof tokens.data.expires_in === "string") {
	const accessTokenExpiresIn = Number(tokens.data.expires_in);
}
```

## Refresh access tokens

Use `refreshAccessToken()` to get a new access token using a refresh token. Naver returns the same values as during the authorization code validation, including the access token expiration which needs to be manually parsed out. This method also returns `OAuth2Tokens` and throws the same errors as `validateAuthorizationCode()`

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await naver.refreshAccessToken(refreshToken);
	const accessToken = tokens.accessToken();
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

## Get user profile

Use the [`/v1/nid/me` endpoint](https://developers.naver.com/docs/login/devguide/devguide.md#3-4-5-접근-토큰을-이용하여-프로필-api-호출하기).

```ts
const response = await fetch("https://openapi.naver.com/v1/nid/me", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```
