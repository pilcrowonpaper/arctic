---
title: "Spotify"
---

# Spotify

For usage, see [OAuth 2.0 provider](../oauth2.md).

```ts
import { Spotify } from "arctic";

const spotify = new Spotify(clientId, clientSecret, redirectURI);
```

```ts
const url: URL = await spotify.createAuthorizationURL(state, {
	// optional
	scopes,
});
const tokens: SpotifyTokens = await spotify.validateAuthorizationCode(code);
const tokens: SpotifyTokens = await spotify.refreshAccessToken(refreshToken);
```

## Get user profile

Use the [`/users/me` endpoint](https://developer.spotify.com/documentation/web-api/reference/get-current-users-profile).

```ts
const response = await fetch("https://api.spotify.com/v1/me", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```
