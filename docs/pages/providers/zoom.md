---
title: "Zoom"
---

# Zoom

Implements OpenID Connect.

For usage, see [OAuth 2.0 provider with PKCE](/guides/oauth2-pkce).

```ts
import { Zoom } from "arctic";

const zoom = new Zoom(clientId, clientSecret, redirectURI);
```

```ts
const url: URL = await zoom.createAuthorizationURL(state, codeVerifier, {
	// optional
	scopes
});
const tokens: ZoomTokens = await zoom.validateAuthorizationCode(code, codeVerifier);
const tokens: ZoomTokens = await zoom.refreshAccessToken(refreshToken);
```

## Get user profile

Add the `user:read` scope and use the [`/users/me` endpoint](https://developers.zoom.us/docs/api/rest/reference/user/methods/#operation/user).

```ts
const url = await zoom.createAuthorizationURL(state, codeVerifier, {
	scopes: ["user:read"]
});
```

```ts
const tokens = await zoom.validateAuthorizationCode(code, codeVerifier);
const response = await fetch("https://api.zoom.us/v2/users/me", {
	headers: {
		Authorization: `Bearer ${tokens.accessToken}`
	}
});
const user = await response.json();
```
