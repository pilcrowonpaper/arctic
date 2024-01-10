---
title: "Facebook"
---

# Facebook

For usage, see [OAuth 2.0 provider](/guides/oauth2).

```ts
import { Facebook } from "arctic";

const facebook = new Facebook(clientId, clientSecret, redirectURI);
```

```ts
const url: URL = await facebook.createAuthorizationURL(state, {
	// optional
	scopes
});
const tokens: FacebookTokens = await facebook.validateAuthorizationCode(code);
```

## Get user profile

Use the `/me` endpoint. See [user fields](https://developers.facebook.com/docs/graph-api/reference/user#Reading).

```ts
const tokens = await facebook.validateAuthorizationCode(code);

const url = new Request("https://graph.facebook.com/me");
url.searchParams.set("access_token", tokens.accessToken);
url.searchParams.set("fields", ["id", "name", "picture", "email"].join(","));
const response = await fetch(url);
const user = await response.json();
```
