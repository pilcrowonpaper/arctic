---
title: "Authentik"
---

# Authentik

For usage, see [OAuth 2.0 provider with PKCE](/guides/oauth2-pkce).

```ts
import { Authentik } from "arctic";

const AUTHENTIK_URL = "http://localhost:9000";

export const authentik = new Authentik(
	AUTHENTIK_URL,
	AUTHENTIK_CLIENT_ID,
	AUTHENTIK_CLIENT_SECRET,
	AUTHENTIK_REDIRECT
);
```

Authentik with version 2024.2 and higher receive only access token. To get the refresh token as well, you need to include scope `offline_access` in the request. The scope also needs to be enabled in the provider advanced settings.


```ts
const scopes = ["profile", "email", "openid", "offline_access"];

const url: URL = await authentik.createAuthorizationURL(state, {
	scopes
});
```

## Get user profile

Authentik provides endpoint `/application/o/userinfo/` that you can use to fetch the user info once you obtain the Bearer token.

To get and store the `codeVerifier`, see instuctions here: [OAuth 2.0 provider with PKCE](/guides/oauth2-pkce)

```ts
const AUTHENTIK_URL = "http://localhost:9000";
const AUTHENTIK_USER_INFO = "/application/o/userinfo/";
const tokens = await authentik.validateAuthorizationCode(code, codeVerifier);
try {
	const response = await fetch(AUTHENTIK_URL + AUTHENTIK_USER_INFO, {
		headers: {
			Authorization: `Bearer ${tokens.accessToken}`
		}
	});
	const user = await response.json();
} catch (error) {
	console.error(error);
}
```
