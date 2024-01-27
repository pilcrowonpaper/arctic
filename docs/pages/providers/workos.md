---
title: "WorkOS"
---

# WorkOS

For usage, see [OAuth 2.0 provider](/guides/oauth2).

```ts
import { WorkOS } from "arctic";

const workos = new WorkOS(clientId, clientSecret, redirectURI);
```

```ts
const url: URL = await workos.createAuthorizationURL(state);
const tokens: WorkOSTokens = await workos.validateAuthorizationCode(code);
```

## Get user profile

Use the [`/sso/profile` endpoint](https://workos.com/docs/reference/sso/profile/get-user-profile).

```ts
const response = await fetch("https://api.workos.com/sso/profile", {
	headers: {
		Authorization: `Bearer ${tokens.accessToken}`
	}
});
const user = await response.json();
```
