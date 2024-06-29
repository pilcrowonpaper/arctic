---
title: "OAuth 2.0"
---

# OAuth 2.0

Most providers require a client ID, client secret, and redirect URI. The API is nearly identical across providers but always check each provider's guide before implementing.

```ts
import { GitHub } from "arctic";

const github = new GitHub(clientId, clientSecret, redirectURI);
```

## Create authorization URL

Generate state using `generateState()` and store it as a cookie. Use it to create an authorization URL with `createAuthorizationURL()` and redirect the user to it.

Use `addScopes()` to add scopes.

```ts
import { generateState } from "arctic";

const state = generateState();

const url = github.createAuthorizationURL(state);
url.addScopes("user:email", "repo");

// store state as cookie
setCookie("state", state, {
	secure: true, // set to false in localhost
	path: "/",
	httpOnly: true,
	maxAge: 60 * 10 // 10 min
});

return redirect(url);
```

## Validate authorization code

Compare the state, and use `validateAuthorizationCode()` to validate the authorization code. This returns an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), or a standard `Error` (parse errors).

```ts
import { OAuth2RequestError, ArcticFetchError } from "arctic";

const code = request.url.searchParams.get("code");
const state = request.url.searchParams.get("state");

const storedState = getCookie("state");

if (code === null || storedState === null || state !== storedState) {
	// 400
	throw new Error("Invalid request");
}

try {
	const tokens = await github.validateAuthorizationCode(code);
	const accessToken = tokens.accessToken();
} catch (e) {
	if (e instanceof OAuth2RequestError) {
		// Invalid authorization code, credentials, or redirect URI
		const code = e.code;
		// ...
	}
	if (e instanceof ArcticFetchError) {
		// Failed to call `fetch()`
		const cause = e.cause;
		// ...
	}
	// Parse error
}
```

Calling `OAuth2Tokens.accessToken()` for example parses the response and returns the `access_token` field. If it doesn't exist, it will throw a parse `Error`. See each provider's guides for the actual return values.

```ts
const accessToken = tokens.accessToken();
const accessTokenExpiresInSeconds = tokens.accessTokenExpiresInSeconds();
const accessTokenExpiresAt = tokens.accessTokenExpiresAt();
const refreshToken = tokens.refreshToken();
const refreshTokenExpiresInSeconds = tokens.refreshTokenExpiresInSeconds();
const refreshTokenExpiresAt = tokens.refreshTokenExpiresAt();
const idToken = tokens.idToken();
```

Arctic provides [`decodeIdToken()`](/reference/main/decodeIdToken) for decoding the token's payload.

```ts
const claims = decodeIdToken(idToken);
```
