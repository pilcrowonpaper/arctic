---
title: "Reddit"
---

# Reddit

For usage, see [OAuth 2.0 provider](../oauth2.md).

```ts
import { Reddit } from "arctic";

const reddit = new Reddit(clientId, clientSecret, redirectURI);
```

```ts
const url: URL = await reddit.createAuthorizationURL(state, {
	// optional
	scopes
});
const tokens: RedditTokens = await reddit.validateAuthorizationCode(code);
const tokens: RedditTokens = await reddit.refreshAccessToken(refreshToken);
```

## Get user profile

Use the `/me` endpoint.

```ts
const response = await fetch("https://oauth.reddit.com/api/v1/me", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```

## Get refresh token

Set `duration` param to `permanent`.

```ts
const url = await dropbox.createAuthorizationURL();
url.searchParams.set("duration", "permanent");
```
