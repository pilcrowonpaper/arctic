---
title: "Dropbox"
---

# Dropbox

Implements OpenID Connect.

For usage, see [OAuth 2.0 provider with PKCE](/guides/oauth2-pkce).

```ts
import { Dropbox } from "arctic";

const dropbox = new Dropbox(clientId, clientSecret, redirectURI);
```

```ts
const url: URL = await dropbox.createAuthorizationURL(state, {
	// optional
	scopes // "openid" is always included
});
const tokens: DropboxTokens = await dropbox.validateAuthorizationCode(code);
const tokens: DropboxRefreshedTokens = await dropbox.refreshAccessToken(refreshToken);
```

## Get user profile

Add the `profile` scopes. Optionally add the `email` scopes to get user email.

Parse the ID token or use the [`userinfo` endpoint](https://api.dropboxapi.com/2/openid/userinfo). See [supported claims](https://developers.dropbox.com/oidc-guide#oidc-standard).

```ts
const response = await fetch("https://api.dropboxapi.com/2/openid/userinfo", {
	method: "POST".
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```

The [`/users/get_current_account` endpoint](https://www.dropbox.com/developers/documentation/http/documentation#users-get_current_account) can also be used.

## Get refresh token

Set `access_type` params to `offline`.

```ts
const url = await dropbox.createAuthorizationURL();
url.searchParams.set("access_type", "offline");
```
