# Google

Implements OpenID Connect.

For usage, see [OAuth 2.0 provider with PKCE](../oauth2-pkce.md).

```ts
import { Google } from "arctic";

const google = new Google(clientId, clientSecret, redirectURI˝);
```

```ts
const url: URL = await google.createAuthorizationURL(codeVerifier, {
	// optional
	scopes // "openid" always included
});
const tokens: GoogleTokens = await google.validateAuthorizationCode(code, codeVerifier);
const tokens: GoogleRefreshedTokens = await google.refreshAccessToken(refreshToken);
```

## Get user profile

Add the `profile` scopes. Optionally add the `email` scopes to get user email.

```ts
const google = new Google(clientId, clientSecret, redirectURI, {
	scopes: ["profile"]
});
```

Parse the ID token or use the `userinfo` endpoint. See [ID token claims](https://developers.google.com/identity/openid-connect/openid-connect#an-id-tokens-payload).

```ts
const response = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```

## Get refresh token

Set the `access_type` param to `offline`. You will only get the refresh token only in the first sign in.

```ts
const url = await google.createAuthorizationURL();
url.searchParams.set("access_type", "offline");
```
