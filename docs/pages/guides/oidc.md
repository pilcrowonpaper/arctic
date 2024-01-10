---
title: "OpenID Connect"
---

Arctic will use OpenID Connect if the provider supports it. `validateAuthorizationCode()` will return an ID token for OIDC providers, which can be parsed to get the user info.

```ts
import { parseJWT } from "oslo/jwt";

const tokens = await google.validateAuthorizationCode(code, codeVerifier);
const googleUser = parseJWT(tokens.idToken)!.payload;
```
