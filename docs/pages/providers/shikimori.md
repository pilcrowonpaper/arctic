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
import type { ShikimoriTokens } from "arctic";

const url: URL = await shikimori.createAuthorizationURL(state);
const tokens: ShikimoriTokens = await shikimori.validateAuthorizationCode(code);
const refreshedTokens: ShikimoriTokens = await shikimori.refreshAccessToken(refreshToken);
```
