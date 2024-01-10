---
title: "LinkedIn"
---

# LinkedIn

Implements OpenID Connect.

For usage, see [OAuth 2.0 provider](/guides/oauth2).

```ts
import { LinkedIn } from "arctic";

const linkedIn = new LinkedIn(clientId, clientSecret, redirectURI);
```

```ts
const url: URL = await linkedIn.createAuthorizationURL(state, {
	// optional
	scopes // "openid" always included
});
const tokens: LinkedInTokens = await linkedIn.validateAuthorizationCode(code);
const tokens: LinkedInTokens = await linkedIn.refreshAccessToken(refreshToken);
```

## Get user profile

Add the `profile` scopes, and optionally add the `email` scope to get user email.

```ts
const url = await linkedIn.createAuthorizationURL(state, {
	scopes: ["profile", "email"]
});
```

Parse the ID token or use the `userinfo` endpoint. See [ID token claims](https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/sign-in-with-linkedin-v2#response-body-schema).

```ts
const tokens = await linkedIn.validateAuthorizationCode(code);
const response = await fetch("https://api.linkedin.com/v2/userinfo", {
	headers: {
		Authorization: `Bearer ${tokens.accessToken}`
	}
});
const user = await response.json();
```
