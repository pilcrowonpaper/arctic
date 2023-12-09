# Keycloak

Implements OpenID Connect.

For usage, see [OAuth 2.0 provider with PKCE](../oauth2-pkce.md).

```ts
import { Keycloak } from "arctic";

const realmURL = "https://example.com/realms/xxx";

const keycloak = new Keycloak(realmURL, clientId, clientSecret, redirectURI);
```

```ts
const url: URL = await keycloak.createAuthorizationURL(state, {
	// optional
	scope
});
const tokens: KeycloakTokens = await keycloak.validateAuthorizationCode(code);
const tokens: KeycloakTokens = await keycloak.refreshAccessToken(refreshToken);
```

## Get user profile

Add the `profile` scope. Optionally add the `email` scope to get user email.

```ts
const keycloak = new Keycloak(realmURL, clientId, clientSecret, redirectURI, {
	scope: ["profile", "email"]
});
```

Parse the ID token or use the `userinfo` endpoint.

```ts
const response = await fetch("https://example.com/realms/xxx/protocol/openid-connect/userinfo", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```
