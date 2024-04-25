---
title: "Roblox"
---

# Roblox

Implements OpenID Connect.

For usage, see [OAuth 2.0 provider with PKCE](/guides/oauth2-pkce).

```ts
import { Roblox } from "arctic";

const roblox = new Roblox(clientId, clientSecret, redirectURI);
```

```ts
const url: URL = await roblox.createAuthorizationURL(state, codeVerifier, {
	// optional
	scopes // "openid" always included
});
const tokens: RobloxTokens = await roblox.validateAuthorizationCode(code, codeVerifier);
const tokens: RobloxTokens = await roblox.refreshAccessToken(refreshToken);
```

## Get user profile

Add the `profile` scope.

```ts
const url = await roblox.createAuthorizationURL(state, codeVerifier, {
	scopes: ["profile"]
});
```

Parse the ID token or use the [`userinfo` endpoint](https://create.roblox.com/docs/cloud/reference/oauth2#get-v1userinfo).

```ts
const tokens = await roblox.validateAuthorizationCode(code, codeVerifier);
const response = await fetch("https://apis.roblox.com/oauth/v1/userinfo", {
	headers: {
		Authorization: `Bearer ${tokens.accessToken}`
	}
});
const user = await response.json();
```
