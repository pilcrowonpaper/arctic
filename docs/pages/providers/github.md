---
title: "GitHub"
---

# GitHub

For usage, see [OAuth 2.0 provider](/guides/oauth2).

```ts
import { GitHub } from "arctic";

const github = new GitHub(clientId, clientSecret, {
	// optional
	redirectURI // required when multiple redirect URIs are defined
});
```

```ts
const url: URL = await github.createAuthorizationURL(state, {
	// optional
	scopes
});
const tokens: GitHubTokens = await github.validateAuthorizationCode(code);
```

## Get user profile

Use the [`/user` endpoint](https://docs.github.com/en/rest/users/users?apiVersion=2022-11-28#get-the-authenticated-user).

```ts
const response = await fetch("https://api.github.com/user", {
	headers: {
		Authorization: `Bearer ${tokens.accessToken}`
	}
});
const user = await response.json();
```

## Get email

Add the `email` scope and use the [`/user/emails` endpoint](https://docs.github.com/en/rest/users/emails?apiVersion=2022-11-28#list-email-addresses-for-the-authenticated-user).

```ts
const url = await github.createAuthorizationURL(state, {
	scopes: ["email"]
});
```

```ts
const tokens = await github.validateAuthorizationCode(code);
const response = await fetch("https://api.github.com/user/emails", {
	headers: {
		Authorization: `Bearer ${tokens.accessToken}`
	}
});
const emails = await response.json();
```
