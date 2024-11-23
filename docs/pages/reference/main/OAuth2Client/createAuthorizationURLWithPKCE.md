---
title: "OAuth2Client.createAuthorizationURLWithPKCE()"
---

# OAuth2Client.createAuthorizationURLWithPKCE()

Creates an authorization URL for PKCE flow. The `scope` query parameter will not be set if `scopes` parameter is a empty array.

## Definition

```ts
//$ CodeChallengeMethod=/reference/main/CodeChallengeMethod
function createAuthorizationURLWithPKCE(
	authorizationEndpoint: string,
	state: string,
	codeChallengeMethod: $$CodeChallengeMethod,
	codeVerifier: string,
	scopes: string[]
);
```

### Parameters

- `authorizationEndpoint`
- `state`
- `codeChallengeMethod`
- `codeVerifier`
- `scopes`
