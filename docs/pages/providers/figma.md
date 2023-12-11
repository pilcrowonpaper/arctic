---
title: "Figma"
---

# Figma

For usage, see [OAuth 2.0 provider](../oauth2.md).

```ts
import { Figma } from "arctic";

const figma = new Figma(clientId, clientSecret, redirectURI);
```

```ts
const url: URL = await figma.createAuthorizationURL(state, {
	// optional
	scopes
});
const tokens: FigmaTokens = await figma.validateAuthorizationCode(code);
const tokens: FigmaRefreshedTokens = await figma.refreshAccessToken(refreshToken);
```

## Get user profile

Use the [`/me` endpoint](https://www.figma.com/developers/api#get-me-endpoint).

```ts
const response = await fetch("https://api.figma.com/v1/me", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```
