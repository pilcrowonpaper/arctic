---
title: "Arctic documentation"
---

# Arctic documentation

Arctic is an OAuth 2.0 library for JavaScript/TypeScript that supports numerous providers. It runs on any runtime, including Node.js, Bun, Deno, and Cloudflare Workers.G

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
