---
title: "Arctic v3 documentation"
---

# Arctic v3 documentation

_See [v1.arcticjs.dev](https://v1.arcticjs.dev) for the v1 docs._

_See [v2.arcticjs.dev](https://v2.arcticjs.dev) for the v2 docs._

Arctic is a collection of OAuth 2.0 clients for popular providers. Only the authorization code flow is supported. Built on top of the Fetch API, it's light weight, fully-typed, and runtime-agnostic.

```ts
import * as arctic from "arctic";

const github = new arctic.GitHub(clientId, clientSecret, redirectURI);

const state = arctic.generateState();
const scopes = ["user:email"];
const authorizationURL = github.createAuthorizationURL(state, scopes);

// ...

const tokens = await github.validateAuthorizationCode(code);
const accessToken = tokens.accessToken();
```

> Arctic only supports providers that follow the OAuth 2.0 spec (including PKCE and token revocation).

## Installation

```
npm install arctic
```

### Polyfill

If you're using Node.js 18, you'll need to polyfill the Web Crypto API. This is not required in Node.js 20, Bun, Deno, and Cloudflare Workers.

```ts
import { webcrypto } from "node:crypto";

globalThis.crypto = webcrypto as Crypto;
```

## Semver

Arctic does not strictly follow semantic versioning. While we aim to only introduce breaking changes in major versions, we may introduce them in a minor update if a provider updates their API in a non-backward compatible way. However, they will never be introduced in a patch update.
