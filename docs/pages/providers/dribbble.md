---
title: "Dribbble"
---

# Dribbble

For usage, see [OAuth 2.0 provider](/guides/oauth2).

```ts
import { Dribbble } from "arctic";

const dribbble = new Dribbble(clientId, clientSecret, redirectURI);
```

```ts
const url: URL = await dribbble.createAuthorizationURL(state, {
	// optional
	scopes
});
const tokens: DribbbleTokens = await dribbble.validateAuthorizationCode(code);
```

## Get user profile

Use the [`/user` endpoint](https://developer.dribbble.com/v2/user).

```ts
const tokens = await dribbble.validateAuthorizationCode(code);
const response = await fetch("https://api.dribbble.com/v2/user", {
	headers: {
		Authorization: `Bearer ${tokens.accessToken}`
	}
});
const user = await response.json();
```