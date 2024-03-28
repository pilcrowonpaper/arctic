---
title: "MyAnimeList"
---

# MyAnimeList

Implements OpenID Connect.

For usage, see [OAuth 2.0 provider with PKCE](/guides/oauth2-pkce).

```ts
import { MyAnimeList } from "arctic";

const mal = new MyAnimeList(clientId, clientSecret, {
	// optional
	redirectURI // only required if you have multiple URIs registered
});
```

```ts
const url: URL = await mal.createAuthorizationURL(state, codeVerifier);
const tokens: MyAnimeListTokens = await mal.validateAuthorizationCode(code, codeVerifier);
const tokens: MyAnimeListTokens = await mal.refreshAccessToken(refreshToken);
```

## Get user profile

Use the [`/users` endpoint](https://myanimelist.net/apiconfig/references/api/v2#operation/users_user_id_get).

```ts
const tokens = await mal.validateAuthorizationCode(code, codeVerifier);
const response = await fetch("https://api.myanimelist.net/v2/users/@me, {
	headers: {
		Authorization: `Bearer ${tokens.accessToken}`
	}
});
const user = await response.json();
```
