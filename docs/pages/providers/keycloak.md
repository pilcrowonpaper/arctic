---
title: "Keycloak"
---

# Keycloak

Implements OpenID Connect.

For usage, see [OAuth 2.0 provider with PKCE](/guides/oauth2-pkce).

```ts
import { Keycloak } from "arctic";

const realmURL = "https://example.com/realms/xxx";

const keycloak = new Keycloak(realmURL, clientId, clientSecret, redirectURI);
```

```ts
const url: URL = await keycloak.createAuthorizationURL(state, codeVerifier, {
	// optional
	scopes
});
const tokens: KeycloakTokens = await keycloak.validateAuthorizationCode(code);
const tokens: KeycloakTokens = await keycloak.refreshAccessToken(refreshToken);
```

## Get user profile

Add the `profile` scope. Optionally add the `email` scope to get user email.

```ts
const url = await keycloak.createAuthorizationURL(state, codeVerifier, {
	scopes: ["profile", "email"]
});
```

Parse the ID token or use the `userinfo` endpoint.

```ts
const tokens = await keycloak.validateAuthorizationCode(code, codeVerifier);
const response = await fetch("https://example.com/realms/xxx/protocol/openid-connect/userinfo", {
	headers: {
		Authorization: `Bearer ${tokens.accessToken}`
	}
});
const user = await response.json();
```
