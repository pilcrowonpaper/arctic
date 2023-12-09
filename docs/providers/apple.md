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
	scope,
	responseMode: "form_post" // "query" by default
});
const tokens: AppleTokens = await apple.validateAuthorizationCode(code);
const tokens: AppleRefreshedTokens = await apple.refreshAccessToken(refreshToken);
```

## Get user profile

Parse the ID token. See [ID token claims](https://developer.apple.com/documentation/sign_in_with_apple/sign_in_with_apple_rest_api/authenticating_users_with_sign_in_with_apple#3383773).

## Requesting scopes

When requesting scopes, the `responseMode` option must be set to `"form_post"`. Unlike the default `"query"` response mode, **Apple will send an application/x-www-form-urlencoded POST request as the callback,** and the user JSON object will be sent in the request body. This is only available the first time the user signs in.

```ts
const apple = new Apple(credentials, redirectURI, {
	responseMode: "form_post"
});
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
