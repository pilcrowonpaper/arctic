---
title: "UnexpectedErrorResponseBodyError"
---

# UnexpectedErrorResponseBodyError

Extends `Error`.

Indicates an unexpected error response JSON body.

## Properties

```ts
interface Properties {
	status: number;
	data: unknown;
}
```

- `status`: Response body status.
- `data`: `JSON.parse()`-ed response body.
