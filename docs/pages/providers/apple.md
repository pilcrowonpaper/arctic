---
title: "Apple"
---

# Apple

Supported scopes are `email` and `name`.

For usage, see [OAuth 2.0 provider](../oauth2.md).

```ts
import { Apple } from "arctic";

import type { AppleCredentials } from "arctic";

const credentials: AppleCredentials = {
	clientId,
	teamId,
	keyId,
	certificate
};

const apple = new Apple(credentials, redirectURI);
```

```ts
const url: URL = await apple.createAuthorizationURL(state, {
	// optional
	scopes
});
const tokens: AppleTokens = await apple.validateAuthorizationCode(code);
const tokens: AppleRefreshedTokens = await apple.refreshAccessToken(refreshToken);
```

## Get user profile

Parse the ID token. See [ID token claims](https://developer.apple.com/documentation/sign_in_with_apple/sign_in_with_apple_rest_api/authenticating_users_with_sign_in_with_apple#3383773).

## Requesting scopes

When requesting scopes, the `response_mode` param must be set to `form_post`. Unlike the default `"query"` response mode, **Apple will send an application/x-www-form-urlencoded POST request as the callback,** and the user JSON object will be sent in the request body. This is only available the first time the user signs in.

```ts
const url = await apple.createAuthorizationURL();
url.searchParams.set("response_mode", "query");
```

```ts
app.post("/login/apple/callback", async (request: Request) => {
	const formData = await request.formData();
	const userJSON = formData.get("user");
	if (typeof userJSON === "string") {
		const user = JSON.parse(userJSON);
		const {
			name: { firstName, lastName },
			email
		} = user;
	}
});
```
