---
title: "Tiltify"
---

# Tiltify

For usage, see [OAuth 2.0 provider](/guides/oauth2).

```ts
import { Tiltify } from "arctic";

const tiltify = new Tiltify(clientId, clientSecret, redirectURI);
```

```ts
const url: URL = await tiltify.createAuthorizationURL(state, {
	// optional
	scopes
});
const tokens: TiltifyTokens = await tiltify.validateAuthorizationCode(code);
const tokens: TiltifyTokens = await tiltify.refreshAccessToken(refreshToken);
```

## Get current user

Use the [`/api/public/current-use` endpoint](https://developers.tiltify.com/api-reference/public#tag/user/operation/V5ApiWeb.Public.UserController.current_user) without passing any arguments.

```ts
const tokens = await twitch.validateAuthorizationCode(code);
const response = await fetch("https://v5api.tiltify.com/api/public/current-user", {
	headers: {
		Authorization: `Bearer ${tokens.accessToken}`,
		"Client-Id": clientId
	}
});
const user = await response.json();
```
