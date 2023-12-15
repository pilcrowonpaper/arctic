---
title: "Naver"
---

# Naver

For usage, see [OAuth 2.0 provider](/guides/oauth2).

```ts
import { Naver } from "arctic";

const naver = new Naver(clientId, clientSecret, redirectURI);
```

```ts
const url: URL = await naver.createAuthorizationURL(state);
const tokens: NaverTokens = await naver.validateAuthorizationCode(code);
```

## Get user profile

Use the [`/nid/me` endpoint](https://developers.naver.com/docs/login/profile/profile.md).

```ts
const response = await fetch("https://openapi.naver.com/v1/nid/me", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```
