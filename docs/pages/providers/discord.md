---
title: "Discord"
---

# Discord

For usage, see [OAuth 2.0 provider](/guides/oauth2).

```ts
import { Discord } from "arctic";

const discord = new Discord(clientId, clientSecret, redirectURI);
```

```ts
const url: URL = await discord.createAuthorizationURL(state, {
	// optional
	scopes
});
const tokens: DiscordTokens = await discord.validateAuthorizationCode(code);
const tokens: DiscordTokens = await discord.refreshAccessToken(refreshToken);
```

## Get user profile

Add the `identify` scope and use the [`/users/@me` endpoint`]().

```ts
const url = await discord.createAuthorizationURL(state, {
	scopes: ["identify"]
});
```

```ts
const tokens = await discord.validateAuthorizationCode(code);
const response = await fetch("https://discord.com/api/users/@me", {
	headers: {
		Authorization: `Bearer ${tokens.accessToken}`
	}
});
const user = await response.json();
```
