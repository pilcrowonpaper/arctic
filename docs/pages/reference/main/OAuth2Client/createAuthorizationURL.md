---
title: "OAuth2Client.createAuthorizationURL()"
---

# OAuth2Client.createAuthorizationURL()

Creates an authorization URL. The `scope` query parameter will not be set if `scopes` parameter is a empty array.

## Definition

```ts
function createAuthorizationURL(
	authorizationEndpoint: string,
	state: string,
	scopes: string[]
): URL;
```

### Parameters

- `authorizationEndpoint`
- `state`
- `scopes`
