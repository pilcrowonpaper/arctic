---
title: "Twitter"
---

# Twitter

For Twitter API v2.

For usage, see [OAuth 2.0 provider with PKCE](/guides/oauth2-pkce).

```ts
import { Twitter } from "arctic";

const twitter = new Twitter(clientId, clientSecret, redirectURI);
```

```ts
const url: URL = await twitter.createAuthorizationURL(state, codeVerifier, {
	// optional
	scopes
});
const tokens: TwitterTokens = await twitter.validateAuthorizationCode(code, codeVerifier);
const tokens: TwitterTokens = await twitter.refreshAccessToken(refreshToken);
```

## Get user profile

Add the `users.read` and `tweet.read` scopes and use the [`/users/me` endpoint](https://developer.twitter.com/en/docs/twitter-api/users/lookup/api-reference/get-users-me). You cannot get user emails with the v2 API.

```ts
const url = await twitter.createAuthorizationURL(state, codeVerifier, {
	scopes: ["users.read", "tweet.read"]
});
```

```ts
const tokens = await twitter.validateAuthorizationCode(code, codeVerifier);
const response = await fetch("https://api.twitter.com/2/users/me", {
	headers: {
		Authorization: `Bearer ${tokens.accessToken}`
	}
});
const user = await response.json();
```

## Get refresh token

Add the `offline.access` scope to get refresh tokens.

```ts
const url = await twitter.createAuthorizationURL(state, codeVerifier, {
	scopes: ["users.read", "tweet.read", "offline.access"]
});
```
