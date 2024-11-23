---
title: "OAuth2Client.validateAuthorizationCode()"
---

# OAuth2Client.validateAuthorizationCode()

Validates an authorization code for an access token. Pass `codeVerifier` for PKCE.

## Definitions

```ts
//$ OAuth2Tokens=/reference/main/OAuth2Tokens
async function validateAuthorizationCode(
	tokenEndpoint: string,
	code: string,
	codeVerifier: string | null
): Promise<$$OAuth2Tokens>;
```

### Parameters

- `tokenEndpoint`
- `code`
- `codeVerifier`
