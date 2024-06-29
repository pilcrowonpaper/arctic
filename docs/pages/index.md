---
title: "Arctic documentation"
---

# Arctic documentation

**This is the v2 docs!**

Arctic is a collection of OAuth 2.0 clients for popular providers. It only supports the authorization code grant type and intended to be used server-side. Built on top of the Fetch API, it's light weight, fully-typed, and runtime-agnostic.

```ts
import { GitHub, generateState } from "arctic";

const github = new GitHub(clientId, clientSecret);

const state = generateState();
const authorizationURL = github.createAuthorizationURL(state);
authorizationURL.addScopes("user:email");

const tokens = await github.validateAuthorizationCode(code);
const accessToken = tokens.accessToken();
```

For a generic OAuth 2.0 client, see [`@oslojs/oauth2`](https://github.com/oslo-project/oauth2).

> Arctic only supports providers that follow the OAuth 2.0 spec (including PKCE and token revocation).

## Installation

```
npm install arctic@next
```

### Polyfill

If you're using Node.js 18, you'll need to polyfill the Web Crypto API. This is not required in Node.js 20, Bun, Deno, and Cloudflare Workers.

```ts
import { webcrypto } from "node:crypto";

globalThis.crypto = webcrypto as Crypto;
```

## Semver

Arctic does not strictly follow semantic versioning. While we aim to only introduce breaking changes in major versions, we may introduce them in a minor update if a provider updates their API in a non-backward compatible way. However, they will never be introduced in a patch update.
