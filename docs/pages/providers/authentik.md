---
title: "Authentik"
---

# Authentik

For usage, see [OAuth 2.0 provider with PKCE](/guides/oauth2-pkce).

```ts
import { Authentik } from "arctic";

const realmURL = "http://example.com";
const authentik = new Authentik(realmURL, clientId, clientSecret, redirectURI);
```

```ts
const url: URL = await authentik.createAuthorizationURL(state, codeVerifier, {
	// optional
	scopes // "openid" always included
});
const tokens: AuthentikTokens = await authentik.validateAuthorizationCode(code, codeVerifier);
const tokens: AuthentikTokens = await authentik.refreshAccessToken(refreshToken);
```

## Get refresh token

Authentik with version 2024.2 and higher only provides the access token by default. To get the refresh token as well, you'll need to include the `offline_access` scope. The scope also needs to be enabled in your app's advanced settings (Application > Providers > Edit > Advanced protocol settings > Scopes).


```ts
const url: URL = await authentik.createAuthorizationURL(state, codeVerifier, {
	scopes: ["profile", "email", "offline_access"]
});
```

## Get user profile

Authentik provides endpoint `/application/o/userinfo/` that you can use to fetch the user info once you obtain the Bearer token.

```ts
const tokens = await authentik.validateAuthorizationCode(code, codeVerifier);
const response = await fetch("https://example.com/application/o/userinfo/", {
	headers: {
		Authorization: `Bearer ${tokens.accessToken}`
	}
});
const user = await response.json();
```
