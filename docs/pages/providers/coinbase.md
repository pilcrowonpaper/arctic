---
title: "Coinbase"
---

# Coinbase

For usage, see [OAuth 2.0 provider](/guides/oauth2).

```ts
import { Coinbase } from "arctic";

const coinbase = new Coinbase(clientId, clientSecret, {
	// optional
	redirectURI
});
```

```ts
const url: URL = await coinbase.createAuthorizationURL(state, {
	// optional
	scopes
});
const tokens: CoinbaseTokens = await coinbase.validateAuthorizationCode(code);
const tokens: CoinbaseTokens = await coinbase.refreshAccessToken(refreshToken);
```

## Get user profile

Use the [`/user` endpoint`](https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-users#show-current-user).

```ts
const tokens = await coinbase.validateAuthorizationCode(code);
const response = await fetch("https://api.coinbase.com/v2/user", {
	headers: {
		Authorization: `Bearer ${tokens.accessToken}`
	}
});
const user = await response.json();
```
