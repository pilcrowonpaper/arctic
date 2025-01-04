---
title: "Apple"
---

# Apple

OAuth 2.0 provider for Apple.

Also see the [OAuth 2.0](/guides/oauth2) guide.

## Initialization

The PKCS#8 private key is an instance of `Uint8Array`.

```ts
import * as arctic from "arctic";

const apple = new arctic.Apple(clientId, teamId, keyId, pkcs8PrivateKey, redirectURI);
```

Here is an example to extract the PKCS#8 key from the PEM certificate.

```ts
import * as encoding from "@oslojs/encoding";

const certificate = `-----BEGIN PRIVATE KEY-----
TmV2ZXIgZ29ubmEgZ2l2ZSB5b3UgdXANCk5ldmVyIGdvbm5hIGxldCB5b3UgZG93bg0KTmV2ZXIgZ29ubmEgcnVuIGFyb3VuZCBhbmQgZGVzZXJ0IHlvdQ0KTmV2ZXIgZ29ubmEgbWFrZSB5b3UgY3J5DQpOZXZlciBnb25uYSBzYXkgZ29vZGJ5ZQ0KTmV2ZXIgZ29ubmEgdGVsbCBhIGxpZSBhbmQgaHVydCB5b3U
-----END PRIVATE KEY-----`;
const privateKey = encoding.decodeBase64IgnorePadding(
	certificate
		.replace("-----BEGIN PRIVATE KEY-----", "")
		.replace("-----END PRIVATE KEY-----", "")
		.replaceAll("\r", "")
		.replaceAll("\n", "")
		.trim()
);
```

## Create authorization URL

```ts
import * as arctic from "arctic";

const state = arctic.generateState();
const scopes = ["name", "email"];
const url = apple.createAuthorizationURL(state, scopes);
```

### Requesting scopes

When requesting scopes, the `response_mode` query parameter must be set to `form_post`.

```ts
const url = apple.createAuthorizationURL(state, scopes);
url.searchParams.set("response_mode", "form_post");
```

Unlike the default `"query"` response mode, **Apple will send an application/x-www-form-urlencoded POST request as the callback,** and the user JSON object will be sent in the request body. This is only available the first time the user signs in.

Since this is a cross-origin form request, make sure to relax your CSRF protections, including setting `SameSite` attribute of the state cookie to `None`.

```
/callback?user=%7B%22name%22%3A%7B%22firstName%22%3A%22John%22%2C%22lastName%22%3A%22Doe%22%7D%2C%22email%22%3A%22john%40example.com%22%7D&state=STATE
```

```json
{ "name": { "firstName": "John", "lastName": "Doe" }, "email": "john@example.com" }
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), [`UnexpectedResponseError`](/reference/main/UnexpectedResponseError), or [`UnexpectedErrorResponseBodyError`](/reference/main/UnexpectedErrorResponseBodyError). The ID token will always be returned regardless of the scope. T access token and refresh token currently does not have any uses.

Arctic provides [`decodeIdToken()`](/reference/main/decodeIdToken) for decoding the ID token's payload.

```ts
import * as arctic from "arctic";

try {
	const tokens = await apple.validateAuthorizationCode(code);
	const idToken = tokens.idToken();
} catch (e) {
	if (e instanceof arctic.OAuth2RequestError) {
		// Invalid authorization code, credentials, or redirect URI
		const code = e.code;
		// ...
	}
	if (e instanceof arctic.ArcticFetchError) {
		// Failed to call `fetch()`
		const cause = e.cause;
		// ...
	}
	// Parse error
}
```
