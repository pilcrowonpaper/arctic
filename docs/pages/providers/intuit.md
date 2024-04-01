---
title: "Intuit"
---

# Intuit

Implements OpenID Connect.

For usage, see [OAuth 2.0 provider](/guides/oauth2).

```ts
import { Intuit } from "arctic";

const intuit = new Intuit(clientId, clientSecret, redirectURI);
```

```ts
const url: URL = await intuit.createAuthorizationURL(state, {
	// optional
	scopes // "openid" always included
});
const tokens: IntuitTokens = await intuit.validateAuthorizationCode(code);
const refreshedTokens: IntuitTokens = await intuit.refreshAccessToken(refreshToken);
```

## Get user profile

Add the `profile` scope. Optionally add the `email` scope to get user email, the `phone` scope to get user phone, or the `address` scope to get the user address.

```ts
const url = await intuit.createAuthorizationURL(state, codeVerifier, {
	scopes: ["profile", "email", "phone", "address"]
});
```

Parse the ID token or use the `userinfo` endpoint. See [ID token claims](https://developer.intuit.com/app/developer/qbo/docs/develop/authentication-and-authorization/openid-connect#obtaining-user-profile-information).

```ts
const tokens = await intuit.validateAuthorizationCode(code, codeVerifier);
const response = await fetch("https://accounts.platform.intuit.com/v1/openid_connect/userinfo", {
	headers: {
		Authorization: `Bearer ${tokens.accessToken}`
	}
});
const user = await response.json();
```
