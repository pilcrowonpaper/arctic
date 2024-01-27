---
title: "Amazon Cognito"
---

# Amazon Cognito

Implements OpenID Connect.

For usage, see [OAuth 2.0 provider with PKCE](/guides/oauth2-pkce).

```ts
import { AmazonCognito } from "arctic";

const userPoolDomain = "https://example.auth.region.amazoncognito.com";
const amazonCognito = new AmazonCognito(userPoolDomain, clientId, clientSecret, redirectURI);
```

```ts
const url: URL = await amazonCognito.createAuthorizationURL(state, codeVerifier, {
	// optional
	scopes // "openid" always included
});
const tokens: AmazonCognitoTokens = await amazonCognito.validateAuthorizationCode(
	code,
	codeVerifier
);
const tokens: AmazonCognitoRefreshedTokens = await amazonCognito.refreshAccessToken(refreshToken);
```

## Get user profile

Parse the ID token or use the `userinfo` endpoint. See [sample ID token claims](https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims).

```ts
const tokens = await amazonCognito.validateAuthorizationCode(code, codeVerifier);
const response = await fetch(userPoolDomain + "/oauth/userInfo", {
	headers: {
		Authorization: `Bearer ${tokens.accessToken}`
	}
});
const user = await response.json();
```
