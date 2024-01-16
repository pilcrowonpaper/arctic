---
title: "Apple"
---

# Apple

Supported scopes are `email` and `name`.

For usage, see [OAuth 2.0 provider](/guides/oauth2).

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

When requesting scopes, the `response_mode` param must be set to `form_post`. Unlike the default `"query"` response mode, **Apple will send an application/x-www-form-urlencoded POST request as the callback,** and the user JSON object will be sent in the request body. This is only available the first time the user signs in. Make sure to set the state cookie with the `SameSite=None` attribute.

```ts
import { generateState } from "arctic";

const state = generateState();
const url = await apple.createAuthorizationURL(state);
url.searchParams.set("response_mode", "query");

setCookie("state", state, {
	secure: true, // set to false in localhost
	path: "/",
	httpOnly: true,
	maxAge: 60 * 10, // 10 min
	sameSite: "none" // IMPORTANT!
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

If you have CSRF protection implemented, you must allow form submissions from Apple or disable CSRF protection for specific routes.

```ts
import { verifyRequestOrigin } from "lucia";

const originHeader = request.headers.get("Origin");
const hostHeader = request.headers.get("Host");
if (
	!originHeader ||
	!hostHeader ||
	!verifyRequestOrigin(originHeader, [hostHeader, "appleid.apple.com"])
) {
	return new Response(null, {
		status: 403
	});
}
```
