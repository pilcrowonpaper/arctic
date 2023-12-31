---
title: "OAuth 2.0 with PKCE"
---

# OAuth 2.0 with PKCE

Most providers require a client ID, client secret, and redirect URI.

```ts
import { Google } from "arctic";

const google = new Google(clientId, clientSecret, redirectURI);
```

## Create authorization URL

Generate a state and code verifier using `generateState()` and `generateCodeVerifier()`. Use them to create an authorization URL with `createAuthorizationURL()`, store the state and code verifier as cookies, and redirect the user to the authorization url.

You may optionally pass `scopes`. For providers that implement OpenID Connect, `openid` is always included. There may be more options depending on the provider.

```ts
import { generateCodeVerifier, generateState } from "arctic";

const state = generateState();
const codeVerifier = generateCodeVerifier();

const url = await google.createAuthorizationURL(state, codeVerifier);

// store state verifier as cookie
setCookie("state", state, {
	secure: true, // set to false in localhost
	path: "/",
	httpOnly: true,
	maxAge: 60 * 10 // 10 min
});

// store code verifier as cookie
setCookie("code_verifier", codeVerifier, {
	secure: true, // set to false in localhost
	path: "/",
	httpOnly: true,
	maxAge: 60 * 10 // 10 min
});

return redirect(url);
```

## Validate authorization code

Compare the state, and use `validateAuthorizationCode()` to validate the authorization code with the code verifier. This returns an object with an access token, and a refresh token if requested. If the code is invalid, it will throw an [`OAuth2RequestError`](https://oslo.js.org/reference/oauth2/OAuth2RequestError).

```ts
import { OAuth2RequestError } from "arctic";

const code = request.url.searchParams.get("code");
const state = request.url.searchParams.get("state");

const storedState = getCookie("state");
const storedCodeVerifier = getCookie("code_verifier");

if (!code || !storedState || !storedCodeVerifier || state !== storedState) {
	// 400
	throw new Error("Invalid request");
}

try {
	const tokens = await google.validateAuthorizationCode(code, storedCodeVerifier);
} catch (e) {
	if (e instanceof OAuth2RequestError) {
		const { request, message, description } = e;
	}
	// unknown error
}
```

## Refresh access token

If the OAuth provider supports refresh tokens, `refreshAccessToken()` can be used to get a new access token using a refresh token. This will throw an [`OAuth2RequestError`](https://oslo.js.org/reference/oauth2/OAuth2RequestError) if the refresh token is invalid.

```ts
import { OAuth2RequestError } from "arctic";

try {
	const tokens = await google.refreshAccessToken(refreshToken);
} catch (e) {
	if (e instanceof OAuth2RequestError) {
		const { request, message, description } = e;
	}
	// unknown error
}
```
