---
title: "OAuth2RequestError"
---

# OAuth2RequestError

Extends `Error`.

Error indicating that the provider returned an [OAuth 2.0 error response](https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.2.1).

## Properties

```ts
interface Properties {
	code: string;
	description: string | null;
	uri: string | null;
	state: string | null;
}
```

- `code`: The `error` field
- `description`: The `error_description` field
- `uri`: The `error_uri` field
- `state`: The `state` field
