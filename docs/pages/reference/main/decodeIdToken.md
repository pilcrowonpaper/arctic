---
title: "decodeIdToken()"
---

# decodeIdToken

Decodes the ID token payload. This does not validate the signature. Throws an `Error` if the token is malformed.

## Definition

```ts
function decodeIdToken(idToken: string): object;
```

### Parameters

- `idToken`
