# Twitter

Add the `offline.access` scopes to get refresh tokens.

For usage, see [OAuth 2.0 provider with PKCE](../oauth2-pkce.md).

```ts
import { Twitter } from "arctic";

const twitter = new Twitter(clientId, clientSecret, redirectURI);
```

```ts
const url: URL = await twitter.createAuthorizationURL(codeVerifier, {
	// optional
	scopes
});
const tokens: TwitterTokens = await twitter.validateAuthorizationCode(code, codeVerifier);
const tokens: TwitterTokens = await twitter.refreshAccessToken(refreshToken);
```

## Get user profile

Add the `users.read` scopes and use the [`/users/me` endpoint](https://developer.twitter.com/en/docs/twitter-api/users/lookup/api-reference/get-users-me).

```ts
const response = await fetch("https://api.twitter.com/2/users/me", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```
