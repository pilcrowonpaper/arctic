---
title: "Migrate to v3"
---

# Migrate to v3

Arctic v3 is here! This is a small major release that adds support for public OAuth clients. There are only a few breaking changes and most breaking changes are small.

```
npm install arctic@latest
```

## Public clients

For providers that support public clients, you now have the option to pass `null` as the `clientSecret` value.

```ts
import * as arctic from "arctic";

const keycloak = new arctic.KeyCloak(clientId, null, redirectURI);
```

Providers that support PKCE only for public clients now have an optional `codeVerifier` parameter in `createAuthorizationURL()` and `validateAuthorizationCode()` methods. For existing providers that use confidential clients, pass `null`.

```ts
// Confidential clients (existing projects)
const url = discord.createAuthorizationURL(state, null, scopes);
const tokens = await discord.validateAuthorizationCode(code, null);

// Public clients
const url = discord.createAuthorizationURL(state, codeVerifier, scopes);
const tokens = await discord.validateAuthorizationCode(code, codeVerifier);
```

Providers affected by this breaking change are: Auth0, Discord, Spotify, and WorkOS.

## Self-hosted providers

All providers that can be self-hosted now use a unified `baseURL` parameter in their constructors. This is a breaking change only for the GitLab and Authentik provider.

```ts
import * as arctic from "arctic";

// Must include the protocol, can include path segments
const baseURL = "https://my-instance.com/auth";
const gitlab = new arctic.GitLab(baseURL, clientId, clientSecret, redirectURI);
```

## Custom domain providers

All providers that can be hosted under a custom domain now use a unified `domain` parameter in their constructors. This is a breaking change only for the AWS Cognito provider.

```ts
import * as arctic from "arctic";

// Must not include the protocol or path segments
const domain = "my-domain.com";
const cognito = new arctic.AmazonCognito(domain, clientId, clientSecret, redirectURI);
```

## Other changes and details

Please see the [changelog](https://github.com/pilcrowonpaper/arctic/releases/tag/v3.0.0) for details and other small changes.
