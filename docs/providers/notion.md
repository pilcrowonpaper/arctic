# Notion

For usage, see [OAuth 2.0 provider](../oauth2.md).

```ts
import { Notion } from "arctic";

const notion = new Notion(clientId, clientSecret, redirectURI);
```

```ts
const url: URL = await notion.createAuthorizationURL(state);
const tokens: NotionTokens = await notion.validateAuthorizationCode(code);
```

## Get user profile

Use the [`/users/me` endpoint](https://developers.notion.com/reference/get-self).

```ts
const response = await fetch("https://api.notion.com/v1/users/me", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```
