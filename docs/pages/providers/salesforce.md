---
title: "Salesforce"
---

# Salesforce

Implements OpenID Connect.

For usage, see [OAuth 2.0 provider with PKCE](/guides/oauth2-pkce).

```ts
import { Salesforce } from "arctic";

const salesforce = new Salesforce(clientId, clientSecret, redirectURI);
```

```ts
const url: URL = await salesforce.createAuthorizationURL(state, {
	// optional
	scopes
});
const tokens: SalesforceTokens = await salesforce.validateAuthorizationCode(code);
const tokens: SalesforceTokens = await salesforce.refreshAccessToken(refreshToken);
```


## Get user profile

Add the `profile` scopes. Optionally add the `email` scopes to get user email.

```ts
const salesforce = new Salesforce(clientId, clientSecret, redirectURI, {
	scopes: ["profile", "email"]
});
```

Use the [`/userinfo` endpoint](https://help.salesforce.com/s/articleView?id=sf.remoteaccess_using_userinfo_endpoint.htm&type=5).

```ts
const response = await fetch("https://login.salesforce.com/services/oauth2/userinfo", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```
