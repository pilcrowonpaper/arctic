---
title: "VK"
---

# VK

For usage, see [OAuth 2.0 provider](/guides/oauth2).

```ts
import { VK } from "arctic";

const vk = new VK(clientId, clientSecret, redirectURI);
```

```ts
const url: URL = await vk.createAuthorizationURL(state, {
	// optional
	scopes
});
const tokens: VKTokens = await vk.validateAuthorizationCode(code);
```

## Get user profile

Use the [`users.get` endpoint`](https://dev.vk.com/en/method/users.get).

```ts
const tokens = await vk.validateAuthorizationCode(code);
const response = await fetch("https://api.vk.com/method/users.get", {
	headers: {
		Authorization: `Bearer ${tokens.accessToken}`
	}
});
const user = await response.json();
```
