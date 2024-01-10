---
title: "Okta"
---

# Okta

Implements OpenID Connect.

For usage, see [OAuth 2.0 provider with PKCE](/guides/oauth2-pkce).

**Note:** This provider implements a subset of Okta's full OAuth2 implementation. Specifically for applications of the "Web Application" type when using the OIDC sign-in method.

It is also recommended to toggle "Require PKCE as additional verification" under client credentials after creating your application in the Okta admin dashboard, as the implementation forces you to use PKCE anyway.

If you want to utilise the refresh functionality of Arctic you need to toggle the "Refresh Token" option for "Client acting on behalf of a user". You can find this option under "Grant type" in the general settings for the application.

```ts
import { Okta } from "arctic";

const okta = new Okta(oktaDomain, clientId, clientSecret, redirectURI);
```

```ts
const url: URL = await okta.createAuthorizationURL(state, codeVerifier, {
	// optional
	scopes // "openid" always included
});

const tokens: OktaTokens = await okta.validateAuthorizationCode(code, codeVerifier);

const tokens: OktaTokens = await okta.refreshAccessToken(refreshToken, {
	// optional
	scopes // "openid" and "offline_access" always included
});
```
