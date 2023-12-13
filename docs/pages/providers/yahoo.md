---
title: "Yahoo"
---

# Yahoo

Implements OpenID Connect.

For usage, see [OAuth 2.0 provider](/guides/oauth2).

```ts
import { Yahoo } from "arctic";

const yahoo = new Yahoo(clientId, clientSecret, redirectURI);
```

```ts
const url: URL = await yahoo.createAuthorizationURL(state, {
	// optional
	scopes
});
const tokens: YahooTokens = await yahoo.validateAuthorizationCode(code);
const tokens: YahooTokens = await yahoo.refreshAccessToken(refreshToken);
```

## Get user profile

Add the `profile` scopes. Optionally add the `email` scopes to get user email.

Parse the ID token or use the `userinfo` endpoint. See [ID token claims](https://developer.yahoo.com/sign-in-with-yahoo/#get-user-info-api).

```ts
const response = await fetch("https://api.login.yahoo.com/openid/v1/userinfo", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```
