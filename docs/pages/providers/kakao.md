---
title: "Kakao"
---

# Kakao

For usage, see [OAuth 2.0 provider](../oauth2.md).

```ts
import { Kakao } from "arctic";

const kakao = new Kakao(clientId, clientSecret, redirectURI);
```

```ts
const url: URL = await kakao.createAuthorizationURL(state, {
	// optional
	scopes
});
const tokens: KakaoTokens = await kakao.validateAuthorizationCode(code);
const tokens: KakaoTokens = await kakao.refreshAccessToken(refreshToken);
```

## Get user profile

Use the [`/user/me` endpoint](https://developers.kakao.com/docs/latest/en/kakaologin/rest-api#req-user-info).

```ts
const response = await fetch("https://kapi.kakao.com/v2/user/me", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```
