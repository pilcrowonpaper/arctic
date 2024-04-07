---
title: "Strava"
---

# Strava

For usage, see [OAuth 2.0 provider](/guides/oauth2).

```ts
import { Strava } from "arctic";

const strava = new Strava(clientId, clientSecret, redirectURI);
```

```ts
const url: URL = await strava.createAuthorizationURL(state, {
	// optional
	scopes
});
const tokens: StravaTokens = await strava.validateAuthorizationCode(code);
const tokens: StravaTokens = await strava.refreshAccessToken(refreshToken);
```

## Get user profile

Add the `read` scope and use the [`/athlete` endpoint](https://developers.strava.com/docs/reference/#api-Athletes-getLoggedInAthlete). Alternatively, use the `read_all` scope to get all private data.

```ts
const url = await strava.createAuthorizationURL(state, {
	scopes: ["read"]
});
```

```ts
const tokens = await strava.validateAuthorizationCode(code);
const response = await fetch("https://www.strava.com/api/v3/athlete", {
	headers: {
		Authorization: `Bearer ${tokens.accessToken}`
	}
});
const user = await response.json();
```
