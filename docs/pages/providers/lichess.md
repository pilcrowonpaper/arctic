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
import type { LichessUser } from "arctic";

const tokens = await lichess.validateAuthorizationCode(code);
const lichessUserResponse = await fetch("https://lichess.org/api/account/", {
	headers: {
		Authorization: `Bearer ${tokens.accessToken}`
	}
});
const lichessUser: LichessUser = await lichessUserResponse.json();
```

## Get user email
Use the [/api/account/email](https://lichess.org/api#tag/Account/operation/accountEmail) endpoint

Scope specification required:

```ts
const url = await lichess.createAuthorizationURL(state, codeVerifier, {
    scopes: ['email:read'],
  });

const tokens = await lichess.validateAuthorizationCode(code);
const liichessEmailResponse = await fetch("https://lichess.org/api/account/", {
	headers: {
		Authorization: `Bearer ${tokens.accessToken}`
	}
});
const lichessUserEmail = (await lichessUserResponse.json()).email;
```
