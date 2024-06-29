---
title: "Arctic documentation"
---

# Arctic documentation

**The v2 beta is here - [check it out!](https://arcticjs.dev)**

Arctic is a TypeScript library that provides OAuth 2.0 and OpenID Connect clients for major providers. It runs on any runtime, including Node.js, Bun, Deno, and Cloudflare Workers.

If you need a generic OAuth 2.0 client, see [Oslo](https://oslo.js.org).

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
