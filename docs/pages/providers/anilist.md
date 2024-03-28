---
title: "AniList"
---

# AniList

For usage, see [OAuth 2.0 provider](/guides/oauth2).

```ts
import { AniList } from "arctic";

const anilist = new AniList(clientId, clientSecret, redirectURI);
```

```ts
const url: URL = await anilist.createAuthorizationURL(state);
const tokens: AniListTokens = await anilist.validateAuthorizationCode(code);
```
