---
title: "Lichess"
---

# Lichess

For usage, see [OAuth 2.0 provider with PKCE](/guides/oauth2-pkce).

```ts
import { Lichess } from "arctic";

export const lichess = new Lichess(clientId, redirectURI);
```

## Get user profile

Use the [/api/account](https://lichess.org/api#tag/Account/operation/accountMe) endpoint

```ts
const tokens = await lichess.validateAuthorizationCode(code);
const lichessUserResponse = await fetch("https://lichess.org/api/account", {
	headers: {
		Authorization: `Bearer ${tokens.accessToken}`
	}
});
const user = await lichessUserResponse.json();
```

## Get user email

Add the `email:read` scope and use the [/api/account/email](https://lichess.org/api#tag/Account/operation/accountEmail) endpoint

```ts
const url = await lichess.createAuthorizationURL(state, codeVerifier, {
	scopes: ["email:read"]
});
```

```ts
const tokens = await lichess.validateAuthorizationCode(code);
const liichessEmailResponse = await fetch("https://lichess.org/api/account/email", {
	headers: {
		Authorization: `Bearer ${tokens.accessToken}`
	}
});
const { email } = await lichessUserResponse.json();
```
