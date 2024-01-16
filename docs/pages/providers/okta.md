---
title: "Okta"
---

# Okta

Implements OpenID Connect.

For usage, see [OAuth 2.0 provider with PKCE](/guides/oauth2-pkce).

**Note:** This provider implements a subset of Okta's full OAuth2 implementation. Specifically for applications of the "Web Application" type when using the OIDC sign-in method.

It is also recommended to toggle "Require PKCE as additional verification" under client credentials after creating your application in the Okta admin dashboard, as the implementation forces you to use PKCE anyway.

If you want to utilize the refresh functionality of Arctic you need to toggle the "Refresh Token" option for "Client acting on behalf of a user". You can find this option under "Grant type" in the general settings for the application.

```ts
import { Okta } from "arctic";

const oktaDomain = "https://example.okta.com";

const okta = new Okta(oktaDomain, clientId, clientSecret, redirectURI, {
	// optional
	authServerId
});
```

```ts
const url: URL = await okta.createAuthorizationURL(state, codeVerifier, {
	// optional
	scopes // "openid" always included
});

const tokens: OktaTokens = await okta.validateAuthorizationCode(code, codeVerifier);

const tokens: OktaTokens = await okta.refreshAccessToken(refreshToken, {
  // optional
  scopes
});
```

## Get user profile

Add the `profile` scope for basic information. Optionally add the `email` scope to get user email. See [Scopes](https://developer.okta.com/docs/reference/api/oidc/#scopes) for available scopes.

```ts
const url = await okta.createAuthorizationURL(state, codeVerifier, {
	scopes: ["profile", "email"]
});
```

Parse the ID token or use the [`userinfo` endpoint](https://developer.okta.com/docs/reference/api/oidc/#userinfo). See [ID token](https://developer.okta.com/docs/reference/api/oidc/#id-token).

```ts
const tokens = await okta.validateAuthorizationCode(code, codeVerifier);
const response = await fetch(oktaDomain + "/oauth2/v1/userinfo", {
	headers: {
		Authorization: `Bearer ${tokens.accessToken}`
	}
});
const user = await response.json();
```

## Custom auhtorization server

If you are using a [custom authorization server](https://developer.okta.com/docs/concepts/auth-servers/) pass the ID of it to the constructor options.

```ts
import { Okta } from "arctic";

const okta = new Okta(oktaDomain, clientId, clientSecret, redirectURI, {
	authServerId
});
```
