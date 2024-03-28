---
title: "AniList"
---

# AniList

For usage, see [OAuth 2.0 provider](/guides/oauth2).

```ts
import { Anilist } from "arctic";

const anilist = new Anilist(clientId, clientSecret, redirectURI);
```

```ts
const url: URL = await anilist.createAuthorizationURL(state);
const tokens: AnilistTokens = await anilist.validateAuthorizationCode(code);
```

## Make auth requests

```ts
const tokens = await anilist.validateAuthorizationCode(code);

const response = await fetch("https://graphql.anilist.co", {
  method: 'POST'
    headers: {
      Authorization: `Bearer ${tokens.accessToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  json: {
    'query': query
  }
});

const data = await response.json();
```
