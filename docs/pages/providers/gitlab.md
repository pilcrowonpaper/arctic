---
title: "GitLab"
---

# GitLab

For usage, see [OAuth 2.0 provider](/guides/oauth2).

```ts
import { GitLab } from "arctic";

const gitlab = new GitLab(clientId, clientSecret, redirectURI, {
	// optional
	domain: "https://example.com"
});
```

```ts
const url: URL = await gitlab.createAuthorizationURL(state, {
	// optional
	scopes
});
const tokens: GitLabTokens = await gitlab.validateAuthorizationCode(code);
const tokens: GitLabTokens = await gitlab.refreshAccessToken(refreshToken);
```

## Get user profile

Add the `read_user` scopes and use the [`/user` endpoint](https://docs.gitlab.com/ee/api/users.html#list-current-user).

```ts
const response = await fetch("https://gitlab.com/api/v4/user", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```
