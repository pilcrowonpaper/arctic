---
title: "OAuth2Client.refreshAccessToken()"
---

# OAuth2Client.refreshAccessToken()

Refreshes an access token with a refresh token. The `scope` query parameter will not be set if `scopes` parameter is `null`.

## Definition

```ts
//$ OAuth2Tokens=/reference/main/OAuth2Tokens
async function refreshAccessToken(
	tokenEndpoint: string,
	refreshToken: string,
	scopes: string[] | null
): Promise<$$OAuth2Tokens>;
```

### Parameters

- `tokenEndpoint`
- `refreshToken`
- `scopes`
