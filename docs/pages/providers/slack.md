---
title: "Slack"
---

# Slack

Implements OpenID Connect.

For usage, see [OAuth 2.0 provider](../oauth2.md).

```ts
import { Slack } from "arctic";

const slack = new Slack(clientId, clientSecret, redirectURI);
```

```ts
const url: URL = await slack.createAuthorizationURL(state, {
	// optional
	scopes // "openid" always included
});
const tokens: SlackTokens = await slack.validateAuthorizationCode(code);
```

## Get user profile

Add the `profile` scopes. Optionally add the `email` scopes to get user email.

```ts
const slack = new Slack(clientId, clientSecret, redirectURI, {
	scopes: ["profile", "email"]
});
```

Parse the ID token or use the `userinfo` endpoint. See [example ID token claims](https://api.slack.com/authentication/sign-in-with-slack#response).

```ts
const response = await fetch("https://slack.com/api/openid.connect.userInfo", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```
