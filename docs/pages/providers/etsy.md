---
title: "Etsy"
---

# Etsy

Implements OAuth 2.0 with PKCE.

For usage, see [OAuth 2.0 provider with PKCE](/guides/oauth2-pkce).

```ts
import { Etsy } from "arctic";

const etsy = new Etsy(clientId, clientSecret, {
	redirectURI: "https://example.com/callback"
});
```

```ts
const url: URL = await etsy.createAuthorizationURL(state, codeVerifier, {
	// optional
	scopes // No default scopes
});
const tokens: EtsyTokens = await etsy.validateAuthorizationCode(
	code,
	codeVerifier
);
```

## Get user profile

Use the Etsy API to fetch user information. Refer to the [Etsy API documentation](https://developer.etsy.com/documentation/essentials/authentication/#scopes) for available endpoints and required scopes.

```ts
const tokens = await etsy.validateAuthorizationCode(code, codeVerifier);
const response = await fetch("https://openapi.etsy.com/v3/application/users/me", {
	headers: {
		Authorization: `Bearer ${tokens.accessToken}`
	}
});
const user = await response.json();
```

Note: Make sure to include the necessary scopes (e.g., "profile_r") when creating the authorization URL to access user information.
