---
title: "Yandex"
---

# Yandex

For usage, see [OAuth 2.0 provider](/guides/oauth2).

```ts
import { Yandex } from "arctic";

const yandex = new Yandex(clientId, clientSecret, {
	// optional
	redirectURI
});
```

```ts
const url: URL = await yandex.createAuthorizationURL(state, {
	// optional
	scopes
});
const tokens: YandexTokens = await yandex.validateAuthorizationCode(code);
const tokens: YandexTokens = await yandex.refreshAccessToken(refreshToken);
```

## Get user profile

Use the [`/myself` endpoint](https://docs.github.com/en/rest/users/users?apiVersion=2022-11-28#get-the-authenticated-user).

```ts
const response = await fetch("https://api.tracker.yandex.net/v2/myself", {
	headers: {
		Authorization: `OAuth ${tokens.accessToken}`,
		"X-Org-ID": ORGANIZATION_ID
	}
});
const user = await response.json();
```