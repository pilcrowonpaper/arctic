# `arctic`

Library for handling OAuth 2.0 with built-in providers. Light weight, fully-typed, runtime-agnostic. Built using [`oslo`](http://github.com/pilcrowonpaper/oslo). For a more flexible OAuth 2.0 client, see [`oslo/oauth2`](http://github.com/pilcrowonpaper/oslo).

```
npm install arctic
```

## Providers

### OAuth 2.0

See [OAuth 2.0 providers](#oauth-20-providers) for instructions.

- Apple
- Atlassian
- Auth0
- Bitbucket
- Box
- Discord
- Dropbox
- Facebook
- Figma
- Github
- GitLab
- Kakao
- LinkedIn
- Naver
- Notion
- Reddit
- Spotify
- Tumblr
- Twitch
- Yahoo

### OAuth 2.0 with PKCE

See [OAuth 2.0 providers with PKCE](#oauth-20-providers-with-pkce) for instructions.

- Google
- Keycloak
- Line
- Microsoft Entra ID
- Twitter

## OAuth 2.0 providers

Most providers require the `client_id` and `client_secret`. You may also optionally pass `scope`. For OIDC clients, `openid` and `profile` scope are always included.

```ts
import { GitHub } from "arctic";

const github = new GitHub(clientId, clientSecret, {
	scope: ["user:email"] // etc
});
```

Some providers also require the redirect URI.

```ts
import { Google } from "arctic";

const redirectURI = "http://localhost:3000/login/google/callback";

const google = new Google(clientId, clientSecret, redirectURI);
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

### Other

See also:

- [Get the current user](#get-the-current-user)
- [Refresh access tokens](#refresh-access-tokens)

## OAuth 2.0 providers with PKCE

Most providers require the `client_id` and `client_secret`. You may also optionally pass `scope`. For OIDC clients, `openid` and `profile` scope are always included.

```ts
import { GitHub } from "arctic";

const github = new GitHub(clientId, clientSecret, {
	scope: ["user:email"] // etc
});
```

Some providers also require the redirect URI.

```ts
import { Google } from "arctic";

const redirectURI = "http://localhost:3000/login/google/callback";

const google = new Google(clientId, clientSecret, redirectURI);
```

### Create authorization URL

When using the PKCE flow, `state` is not necessary. Generate a code verifier using `generateCodeVerifier()`, and store it as a cookie. Use them to create an authorization URL with `createAuthorizationURL()` and redirect the user to it.

```ts
import { generateState, generateCodeVerifier } from "arctic";

const codeVerifier = generateCodeVerifier();

const url = await github.createAuthorizationURL(state, codeVerifier);

// store code verifier as cookie
setCookie("code_verifier", state, {
	secure: true, // set to false in localhost
	path: "/",
	httpOnly: true,
	maxAge: 60 * 10 // 10 min
});
return redirect(url);
```

### Validate authorization code

Use `validateAuthorizationCode()` to validate the authorization code with the code verifier. This returns an object with an access token, and a refresh token if requested. If the code is invalid, it will throw an `AccessTokenRequestError`.

```ts
import { OAuth2RequestError } from "arctic";

const code = request.url.searchParams.get("code");
const codeVerifier = request.url.searchParams.get("code_verifier");

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
