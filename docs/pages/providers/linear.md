---
title: "Linear"
---

# Linear

For usage, see [OAuth 2.0 provider](/guides/oauth2).

```ts
import { Linear } from "arctic";

const linear = new Linear(clientId, clientSecret, redirectURI);
```

```ts
const url: URL = await linear.createAuthorizationURL(state, {
	// optional
	scopes // "read" always included
});
const tokens: LinearTokens = await linear.validateAuthorizationCode(code);
```

## Get user profile

Use Linear's [GraphQL API](https://developers.linear.app/docs/graphql/working-with-the-graphql-api).

```ts
const tokens = await linear.validateAuthorizationCode(code);
const response = await fetch("https://api.linear.app/graphql", {
    method: "POST",
    body: `{ "query": "{ viewer { id name } }" }`,
	headers: {
        "Content-Type": "application/json"
		Authorization: `Bearer ${tokens.accessToken}`
	}
});
const user = await response.json();
```
