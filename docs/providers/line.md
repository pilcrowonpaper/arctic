# Line

Implements OpenID Connect.

For usage, see [OAuth 2.0 provider with PKCE](../oauth2-pkce.md).

```ts
import { Line } from "arctic";

const line = new Line(clientId, clientSecret, redirectURI);
```

```ts
const url: URL = await line.createAuthorizationURL(codeVerifier, {
	// optional
	scopes // "openid" always included
});
const tokens: LineTokens = await line.validateAuthorizationCode(code, codeVerifier);
const tokens: LineRefreshedTokens = await line.refreshAccessToken(refreshToken);
```

## Get user profile

Add the `profile` scopes. Optionally add the `email` scopes to get user email.

```ts
const line = new Line(clientId, clientSecret, redirectURI, {
	scopes: ["profile", "email"]
});
```

Parse the ID token or use the `userinfo` endpoint. See [ID token claims](https://developers.line.biz/en/docs/line-login/verify-id-token/#signature).

```ts
const response = await fetch("https://api.line.me/oauth2/v2.1/userinfo", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```

Or, alternatively use the [`/profile` endpoint](https://developers.line.biz/en/reference/line-login/#get-user-profile).
