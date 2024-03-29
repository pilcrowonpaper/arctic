---
title: "Shikimori"
---

# Shikimori

For usage, see [OAuth 2.0 provider](/guides/oauth2).

```ts
import { Shikimori } from "arctic";

const shikimori = new Shikimori(clientId, clientSecret, redirectURI);
```

```ts
import type { Tokens } from "arctic";

const url: URL = await shikimori.createAuthorizationURL(state);
const tokens: Tokens = await shikimori.validateAuthorizationCode(code);
const refreshedTokens: Tokens = await shikimori.refreshAccessToken(refreshToken);
```
