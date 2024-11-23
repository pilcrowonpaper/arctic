---
title: "OAuth2Client.refreshAccessToken()"
---

# OAuth2Client.refreshAccessToken()

Refreshes an access token with a refresh token. The `scope` request parameter will not be set if `scopes` parameter is a empty array.

## Definition

```ts
//$ OAuth2Tokens=/reference/main/OAuth2Tokens
async function refreshAccessToken(
	tokenEndpoint: string,
	refreshToken: string,
	scopes: string[]
): Promise<$$OAuth2Tokens>;
```

### Parameters

- `tokenEndpoint`
- `refreshToken`
- `scopes`
