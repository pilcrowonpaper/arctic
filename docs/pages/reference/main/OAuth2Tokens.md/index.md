---
title: "OAuth2Tokens"
---

# OAuth2Tokens

Represents a JSON-parsed successful token response body.

## Constructor

```ts
function constructor(data: object): this;
```

### Parameters

- `data`: JSON-parsed successful response body.

## Methods

- [`accessToken()`](/reference/main/OAuth2Tokens/accessToken)
- [`accessTokenExpiresAt()`](/reference/main/OAuth2Tokens/accessTokenExpiresAt)
- [`accessTokenExpiresInSeconds()`](/reference/main/OAuth2Tokens/accessTokenExpiresInSeconds)
- [`hasRefreshToken()`](/reference/main/OAuth2Tokens/hasRefreshToken)
- [`refreshToken()`](/reference/main/OAuth2Tokens/refreshToken)
- [`refreshTokenExpiresAt()`](/reference/main/OAuth2Tokens/refreshTokenExpiresAt)
- [`refreshTokenExpiresInSeconds()`](/reference/main/OAuth2Tokens/refreshTokenExpiresInSeconds)

## Properties

```ts
interface Properties {
	data: object;
}
```

- `data`: The raw JSON-parsed response body.
