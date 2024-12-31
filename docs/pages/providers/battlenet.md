---
title: "Battle.net"
---

# Battle.net

OAuth 2.0 provider for Battle.net.

Also see the [OAuth 2.0](/guides/oauth2) guide.

## Initialization

```ts
import { BattleNet } from "arctic";

const battlenet = new BattleNet(clientId, clientSecret, redirectURI);
```

## Create authorization URL

```ts
import { generateState } from "arctic";

const state = generateState();
const scopes = ["openid", " wow.profile "];
const url = battlenet.createAuthorizationURL(state, scopes);
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), or a standard `Error` (parse errors).

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

try {
	const tokens = await battlenet.validateAuthorizationCode(code);
	const accessToken = tokens.accessToken();
} catch (e) {
	if (e instanceof OAuth2RequestError) {
		// Invalid authorization code, credentials, or redirect URI
		const code = e.code;
		// ...
	}
	if (e instanceof ArcticFetchError) {
		// Failed to call `fetch()`
		const cause = e.cause;
		// ...
	}
	// Parse error
}
```

## Get user profile

Use the [`User Info` endpoint](https://develop.battle.net/documentation/battle-net/oauth-apis).

```ts
const response = await fetch("https://oauth.battle.net/userinfo", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```
