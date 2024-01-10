---
title: "Line"
---

# Line

Implements OpenID Connect.

For usage, see [OAuth 2.0 provider with PKCE](/guides/oauth2-pkce).

```ts
import { Line } from "arctic";

const line = new Line(clientId, clientSecret, redirectURI);
```

```ts
const url: URL = await line.createAuthorizationURL(state, codeVerifier, {
	// optional
	scopes // "openid" always included
});
const tokens: LineTokens = await line.validateAuthorizationCode(code, codeVerifier);
const tokens: LineRefreshedTokens = await line.refreshAccessToken(refreshToken);
```

## Get user profile

Add the `profile` scope. Optionally add the `email` scope to get user email.

```ts
const url = await line.createAuthorizationURL(state, codeVerifier, {
	scopes: ["profile", "email"]
});
```

Parse the ID token or use the `userinfo` endpoint. See [ID token claims](https://developers.line.biz/en/docs/line-login/verify-id-token/#signature).

```ts
const tokens = await line.validateAuthorizationCode(code, codeVerifier);
const response = await fetch("https://api.line.me/oauth2/v2.1/userinfo", {
	headers: {
		Authorization: `Bearer ${tokens.accessToken}`
	}
});
const user = await response.json();
```

Or, alternatively use the [`/profile` endpoint](https://developers.line.biz/en/reference/line-login/#get-user-profile).
