# Atlassian

For usage, see [OAuth 2.0 provider](../oauth2.md).

```ts
import { Atlassian } from "arctic";

const atlassian = new Atlassian(clientId, clientSecret, redirectURI);
```

```ts
const url: URL = await atlassian.createAuthorizationURL(state, {
	// optional
	scopes,
});
const tokens: AtlassianTokens = await atlassian.validateAuthorizationCode(code);
const tokens: AtlassianTokens = await atlassian.refreshAccessToken(refreshToken);
```


## Get user profile

Add the `read:me` scopes and use the [`/me` endpoint](https://developer.atlassian.com/cloud/confluence/oauth-2-3lo-apps/#how-do-i-retrieve-the-public-profile-of-the-authenticated-user-).

```ts
const response = await fetch("https://api.atlassian.com/me", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```
