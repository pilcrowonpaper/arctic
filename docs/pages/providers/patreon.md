---
title: "Patreon"
---

# Patreon

For usage, see [OAuth 2.0 provider](/guides/oauth2).

```ts
import { Patreon } from "arctic";

const patreon = new Patreon(clientId, clientSecret, redirectURI);
```

```ts
const url: URL = await patreon.createAuthorizationURL(state, {
	// optional
	scopes
});
const tokens: PatreonTokens = await patreon.validateAuthorizationCode(code);
const tokens: PatreonTokens = await patreon.refreshAccessToken(refreshToken);
```

## Get user profile

Add the `identity` scope and use the [`/api/oauth2/v2/identity` endpoint`](https://docs.patreon.com/#get-api-oauth2-v2-identity). Optionally add the `identity[email]` scope to get user email.

```ts
const url = await patreon.createAuthorizationURL(state, {
	scopes: ["identify", "identity[email]"]
});
```

```ts
const tokens = await patreon.validateAuthorizationCode(code);
const response = await fetch("https://www.patreon.com/api/oauth2/v2/identity", {
	headers: {
		Authorization: `Bearer ${tokens.accessToken}`
	}
});
const user = await response.json();
```
