---
title: "Bungie"
---

# Bungie

For usage, see [OAuth 2.0 provider](/guides/oauth2).

For the documentation of the Bungie API, see [Bungie-net/api](https://github.com/Bungie-net/api/wiki/OAuth-Documentation).

> Note: Bungie enforces HTTPS for redirect URIs, including localhost.
```ts
import { Bungie } from "arctic";

// For public applications
const bungie = new Bungie(clientId, redirectURI);

// For confidential applications (includes refresh tokens)
const bungie = new Bungie(clientId, redirectURI, clientSecret);
```

```ts
const url: URL = await bungie.createAuthorizationURL(state);

// Returns refresh_token and refresh_expires_in only for confidential applications.
const tokens: BungieTokens = await bungie.validateAuthorizationCode(code);
```

```ts
// Only for confidential applications, otherwise an error will be thrown.
const tokens: BungieTokens = await bungie.refreshAccessToken(refreshToken);
```


## Get user profile

Add the `account` scope and use the [`GetCurrentBungieNetUser` endpoint](https://destinydevs.github.io/BungieNetPlatform/docs/services/User/User-GetCurrentBungieNetUser).

```ts
const tokens = await bungie.validateAuthorizationCode(code);
const response = await fetch("https://www.bungie.net/Platform/User/GetCurrentBungieNetUser", {
	headers: {
          "Authorization": `Bearer ${tokens.accessToken}`,
          "X-API-Key": "YOUR_API_KEY"
	}
});
const user = await response.json();

console.log(user.Response.uniqueName) // Name#1234
```
