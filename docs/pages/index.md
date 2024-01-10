---
title: "Arctic documentation"
---

# Arctic documentation

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
