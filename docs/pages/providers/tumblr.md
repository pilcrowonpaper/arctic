---
title: "Tumblr"
---

# Tumblr

For usage, see [OAuth 2.0 provider](/guides/oauth2).

```ts
import { Tumblr } from "arctic";

const tumblr = new Tumblr(clientId, clientSecret, redirectURI);
```

```ts
const url: URL = await tumblr.createAuthorizationURL(state);
const tokens: TumblrTokens = await tumblr.validateAuthorizationCode(code);
```

## Get user profile

Use the [`/user/info` endpoint](https://www.tumblr.com/docs/en/api/v2#userinfo--get-a-users-information).

```ts
const response = await fetch("https://api.tumblr.com/v2/user/info", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```