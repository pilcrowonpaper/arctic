# Box

For usage, see [OAuth 2.0 provider](../oauth2.md).

```ts
import { Box } from "arctic";

const box = new Box(clientId, clientSecret, redirectURI);
```
```ts
const url: URL = await box.createAuthorizationURL(state, {
	// optional
	scope
});
const tokens: BoxTokens = await box.validateAuthorizationCode(code);
```

## Get user profile

Use the [`/users/me` endpoint](https://developer.box.com/reference/get-users-me/).

```ts
const response = await fetch("https://api.box.com/2.0/users/me", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```
