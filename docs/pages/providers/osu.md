---
title: "osu!"
---

# osu!

For usage, see [OAuth 2.0 provider](/guides/oauth2).

```ts
import { Osu } from "arctic";

const osu = new Osu(clientId, clientSecret, {
	// optional
	redirectURI // required when multiple redirect URIs are defined
});
```

```ts
const url: URL = await osu.createAuthorizationURL(state, {
	// optional
	scopes
});
const tokens: OsuTokens = await osu.validateAuthorizationCode(code);
const tokens: OsuTokens = await osu.refreshAccessToken(refreshToken);
```

## Get user profile

Use the [`/me` endpoint](https://osu.ppy.sh/docs/index.html#get-own-data).

```ts
const url = await osu.createAuthorizationURL(state, {
	scopes: ["identify"] // implicitly granted by osu!
});
```

```ts
const tokens = await osu.validateAuthorizationCode(code);
const response = await fetch("https://osu.ppy.sh/api/v2/me", {
	headers: {
		Authorization: `Bearer ${tokens.accessToken}`
	}
});
const user = await response.json();
```
