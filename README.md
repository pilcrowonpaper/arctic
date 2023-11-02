# `arctic`

Library for handling OAuth 2.0 with built-in providers. Light weight, fully-typed, runtime-agnostic. Built using [`oslo`](http://github.com/pilcrowonpaper/oslo). For a more flexible OAuth 2.0 client, see [`oslo/oauth2`](http://github.com/pilcrowonpaper/oslo).

```
npm install arctic
```

## Providers

- [Apple](#oauth-20)
- [Azure AD](#oauth-20-with-pkce-flow)
- [Discord](#oauth-20)
- [Facebook](#oauth-20)
- [Github](#oauth-20)
- [Google](#oauth-20)
- [LINE](#oauth-20)
- [Spotify](#oauth-20)
- [Twitch](#oauth-20)
- [Twitter](#oauth-20-with-pkce-flow)

## OAuth 2.0

Most providers require the `client_id` and `client_secret`. You may also optionally pass `scope`. For OIDC clients, `openid` and `profile` scope are always included.

```ts
import { Github } from "arctic";

const github = new Github(clientId, clientSecret, {
	scope: ["user:email"] // etc
});
```

Some providers also require the redirect URI.

```ts
import { Google } from "arctic";

const redirectURI = "http://localhost:3000/login/google/callback";

const github = new Github(clientId, clientSecret, redirectURI);
```

### Create authorization URL

Generate state using `generateState()` and store it as a cookie. Use it to create an authorization URL with `createAuthorizationURL()` and redirect the user to it.

```ts
import { generateState } from "arctic";

const state = generateState();

const url = await github.createAuthorizationURL(state);

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

Compare the state, and use `validateAuthorizationCode()` to validate the authorization code. This returns an object with an access token, and a refresh token if requested. If the code is invalid, it will throw an `AccessTokenRequestError`.

```ts
import { verifyState, OAuth2RequestError } from "arctic";

const code = request.url.searchParams.get("code");
const state = request.url.searchParams.get("state");

const storedState = getCookie("state");

if (!code || !verifyState(state, storedState)) {
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

### Other

See also:

- [Get the current user](#get-the-current-user)
- [Refresh access tokens](#refresh-access-tokens)

## OAuth 2.0 with PKCE flow

Most providers require the `client_id` and `client_secret`. You may also optionally pass `scope`. For OIDC clients, `openid` and `profile` scope are always included.

```ts
import { Github } from "arctic";

const github = new Github(clientId, clientSecret, {
	scope: ["user:email"] // etc
});
```

Some providers also require the redirect URI.

```ts
import { Google } from "arctic";

const redirectURI = "http://localhost:3000/login/google/callback";

const github = new Github(clientId, clientSecret, redirectURI);
```

### Create authorization URL

Generate state and code verifier using `generateState()` and `generateCodeVerifier()`, and store them as cookies. Use them to create an authorization URL with `createAuthorizationURL()` and redirect the user to it.

```ts
import { generateState, generateCodeVerifier } from "arctic";

const state = generateState();
const codeVerifier = generateCodeVerifier();

const url = await github.createAuthorizationURL(state, codeVerifier);

// store state and code verifier as cookie
setCookie("state", state, {
	secure: true, // set to false in localhost
	path: "/",
	httpOnly: true,
	maxAge: 60 * 10 // 10 min
});
setCookie("code_verifier", state, {
	secure: true, // set to false in localhost
	path: "/",
	httpOnly: true,
	maxAge: 60 * 10 // 10 min
});
return redirect(url);
```

### Validate authorization code

Compare the state, and use `validateAuthorizationCode()` to validate the authorization code with the code verifier. This returns an object with an access token, and a refresh token if requested. If the code is invalid, it will throw an `AccessTokenRequestError`.

```ts
import { verifyState, OAuth2RequestError } from "arctic";

const code = request.url.searchParams.get("code");
const state = request.url.searchParams.get("state");
const codeVerifier = request.url.searchParams.get("code_verifier");

const storedState = getCookie("state");

if (!code || !codeVerifier || !verifyState(state, storedState)) {
	// 400
	throw new Error("Invalid request");
}

try {
	const tokens = await github.validateAuthorizationCode(code, codeVerifier);
} catch (e) {
	if (e instanceof OAuth2RequestError) {
		// see https://oslo.js.org/reference/oauth2/OAuth2RequestError/
		const { request, message, description } = e;
	}
	// unknown error
}
```

### Other

See also:

- [Get the current user](#get-the-current-user)
- [Refresh access tokens](#refresh-access-tokens)

## Other

### Get the current user

Some providers expose `getUser()` to get the current user from an access token. This will throw an `RequestError` if the access token is invalid.

```ts
import { RequestError } from "arctic";

try {
	const user = await github.getUser(tokens.accessToken);
} catch (e) {
	if (e instanceof RequestError) {
		// get fetch Request and Response
		const { request, response } = e;
	}
	// unknown error
}
```

### Refresh access tokens

Some providers expose `refreshAccessToken()` to get a new access token from a refresh token. This will throw an `OAuth2RequestError` if the refresh token is invalid.

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
