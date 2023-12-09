# Twitch

For usage, see [OAuth 2.0 provider](../oauth2.md).

```ts
import { Twitch } from "arctic";

const twitch = new Twitch(clientId, clientSecret, redirectURI);
```

```ts
const url: URL = await twitch.createAuthorizationURL(state, {
	// optional
	scopes
});
const tokens: TwitchTokens = await twitch.validateAuthorizationCode(code);
const tokens: TwitchTokens = await twitch.refreshAccessToken(refreshToken);
```

## Get user profile

Use the [`/users` endpoint](https://dev.twitch.tv/docs/api/reference/#get-users) without passing any arguments.

```ts
const response = await fetch("https://api.twitch.tv/helix/users", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```

Add the `user:read:email` to get the user's email.
