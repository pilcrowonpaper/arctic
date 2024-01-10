---
title: "Auth0"
---

# Auth0

Implements OpenID Connect.

For usage, see [OAuth 2.0 provider](/guides/oauth2).

```ts
import { Auth0 } from "arctic";

const appDomain = "https://xxx.auth0.com";

const auth0 = new Auth0(appDomain, clientId, clientSecret, redirectURI);
```

```ts
const url: URL = await auth0.createAuthorizationURL(state, {
	// optional
	scopes
});
const tokens: Auth0Tokens = await auth0.validateAuthorizationCode(code);
const tokens: Auth0Tokens = await auth0.refreshAccessToken(refreshToken);
```

## Get user profile

Add the `profile` scope. Optionally add the `email` scope to get user email.

```ts
const url = await auth0.createAuthorizationURL(state, {
	scopes: ["profile", "email"]
});
```

Parse the ID token or use the `userinfo` endpoint. See [ID token structure](https://auth0.com/docs/secure/tokens/id-tokens/id-token-structure#sample-id-token).

```ts
const tokens = await auth0.validateAuthorizationCode(code);
const response = await fetch("https://xxx.auth.com/userinfo", {
	headers: {
		Authorization: `Bearer ${tokens.accessToken}`
	}
});
const user = await response.json();
```
