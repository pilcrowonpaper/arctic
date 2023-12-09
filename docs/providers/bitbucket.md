# Bitbucket

For usage, see [OAuth 2.0 provider](../oauth2.md).

```ts
import { Bitbucket } from "arctic";

const bitbucket = new Bitbucket(clientId, clientSecret, redirectURI);
```

```ts
const url: URL = await bitbucket.createAuthorizationURL(state, {
	// optional
	scopes
});
const tokens: BitbucketTokens = await bitbucket.validateAuthorizationCode(code);
const tokens: BitbucketTokens = await bitbucket.refreshAccessToken(refreshToken);
```

## Get user profile

Add the `account` scopes and use the [`/user` endpoint](https://developer.atlassian.com/cloud/bitbucket/rest/api-group-users/#api-user-get).

```ts
const response = await fetch("https://api.bitbucket.org/2.0/user", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```
