---
title: "Start.gg"
---

# Start.gg

For usage, see [OAuth 2.0 provider](/guides/oauth2).

```ts
import { Startgg } from "arctic";

const startgg = new Startgg(clientId, clientSecret, redirectURI);
```

```ts
const url: URL = await startgg.createAuthorizationURL(state, {
	// required
	scopes
});
const tokens: StartggTokens = await startgg.validateAuthorizationCode(code);
```

## Get user profile

Add the `user.identity`. Optionally add the `user.email` scope to get user email.
Consult [Start.gg Schema](https://developer.start.gg/reference/user.doc) for additional user return queries.
Here we return the user id, slug, email and gamertag.
```ts
const url = await startgg.createAuthorizationURL(state, {
	scopes: ["user.identity", "user.email"]
});
```

```ts
const tokens = await startgg.validateAuthorizationCode(code);
const response = await fetch("https://api.start.gg/gql/alpha", {
            method: "POST",
            body: `{"query": "{ currentUser {id slug email player { gamerTag } } }" }`,
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${tokens.accessToken}`
            }
        });
const user = await response.json();
```
