---
title: "Synology"
---

# Synology

OAuth 2.0 provider for Synology SSO and OAuth Apps.

Also see the [OAuth 2.0](/guides/oauth2) guide.

## Prerequisites

To use this provider, you have to install [SSO Server](https://www.synology.com/en-us/dsm/packages/SSOServer) package on your Synology NAS.

There you have to:

1. configure the base URL under which the SSO Server will be reachable,
2. enable the OIDC service,
3. create a new OAuth App.

> Note:
> Both the _base URL_ and the _redirect URI_ have to use `https`.

## Initialization

The `baseURL` parameter is the full URL of your Synology NAS,
that you have configured in the SSO Server.
The `redirectURI` parameter is required and has to be one of those configured in the SSO Server for this application.

```ts
import * as arctic from "arctic";

const baseURL = "https://my_synology_nas.local:5001";
const baseURL = "https://sso.nas.example.com";
const synology = new arctic.Synology(baseUrl, clientId, clientPassword, redirectUri);
```

> Note:
> Synology calls `clientId` _Application ID_ and `clientPassword` _Application Secret_.

## Create authorization URL

Synology SSO supports both plain and PKCE OAuth 2.0 authorization flows.

```ts
import * as arctic from "arctic";

const state = arctic.generateState();
const scopes = ["email", "groups", "openid"];
const url = synology.createAuthorizationURL(state, null, scopes);
```

```ts
import * as arctic from "arctic";

const state = arctic.generateState();
const codeVerifier = arctic.generateCodeVerifier();
const scopes = ["email", "groups", "openid"];
const url = synology.createAuthorizationURL(state, codeVerifier, scopes);
```

> Note:
> You can find available scopes in `${baseURL}/webman/sso/.well-known/openid-configuration`

## Validate authorization code

For confidential clients, pass the authorization code.

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](/reference/main/OAuth2Tokens), or throw one of [`OAuth2RequestError`](/reference/main/OAuth2RequestError), [`ArcticFetchError`](/reference/main/ArcticFetchError), [`UnexpectedResponseError`](/reference/main/UnexpectedResponseError), or [`UnexpectedErrorResponseBodyError`](/reference/main/UnexpectedErrorResponseBodyError).

Synology returns an access token and the access token expiration.

```ts
import * as arctic from "arctic";

try {
	const tokens = await spotify.validateAuthorizationCode(code, null);
	const accessToken = tokens.accessToken();
	const accessTokenExpiresAt = tokens.accessTokenExpiresAt();
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

For PKCE clients, pass the authorization code and code verifier.

```ts
const tokens = await spotify.validateAuthorizationCode(code, codeVerifier);
```

## Get user info

Use the `/webman/sso/SSOUserInfo.cgi` endpoint.

```ts
const user_info = await fetch(`${baseURL}/webman/sso/SSOUserInfo.cgi`, {
	headers: {
		Authorization: "Bearer " + access_token
	}
});
const user = await response.json();
```
