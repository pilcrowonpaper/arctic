---
title: "OAuth 2.0"
---

# OAuth 2.0

Most providers require a client ID, client secret, and redirect URI.

```ts
import { Apple } from "arctic";

const apple = new Apple(clientId, clientSecret, redirectURI);
```

### Create authorization URL

Generate state using `generateState()` and store it as a cookie. Use it to create an authorization URL with `createAuthorizationURL()` and redirect the user to it.

You may optionally pass `scopes`. For providers that implement OpenID Connect, `openid` is always included. There may be more options depending on the provider.

```ts
import { generateState } from "arctic";

const state = generateState();

const url = await github.createAuthorizationURL(state, {
	scopes: ["user:email"]
});

// store state as cookie
setCookie("state", state, {
	secure: true, // set to false in localhost
	path: "/",
	httpOnly: true,
	maxAge: 60 * 10 // 10 min
});
return redirect(url);
```

### Validate authorization code

Compare the state, and use `validateAuthorizationCode()` to validate the authorization code. This returns an object with an access token, and a refresh token if requested. If the code or your credentials are invalid, it will throw an [`OAuth2RequestError`](https://oslo.js.org/reference/oauth2/OAuth2RequestError/).

```ts
import { OAuth2RequestError } from "arctic";

const code = request.url.searchParams.get("code");
const state = request.url.searchParams.get("state");

const storedState = getCookie("state");

if (!code || !storedState || state !== storedState) {
	// 400
	throw new Error("Invalid request");
}

try {
	const tokens = await github.validateAuthorizationCode(code);
} catch (e) {
	if (e instanceof OAuth2RequestError) {
		const { message, description, request } = e;
	}
	// unknown error
}
```

### Refresh access token

If the OAuth provider supports refresh tokens, `refreshAccessToken()` can be used to get a new access token using a refresh token. This will throw an [`OAuth2RequestError`](https://oslo.js.org/reference/oauth2/OAuth2RequestError/) if the refresh token is invalid.

```ts
import { OAuth2RequestError } from "arctic";

try {
	const tokens = await google.refreshAccessToken(refreshToken);
} catch (e) {
	if (e instanceof OAuth2RequestError) {
		// see https://oslo.js.org/reference/oauth2/OAuth2RequestError/
		const { request, message, description } = e;
	}
	// unknown error
}
```
