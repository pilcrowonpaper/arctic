# Arctic

Arctic is an OAuth 2.0 library for JavaScript/TypeScript that supports numerous providers. It's light weight, fully-typed, and runtime-agnostic. [Read the documentation →](https://arctic.js.org)

```ts
import { GitHub, generateState } from "arctic";

const github = new GitHub(clientId, clientSecret);

const state = generateState();
const authorizationURL = await github.createAuthorizationURL(state, {
	scopes: ["user:email"]
});

const tokens = await github.validateAuthorizationCode(code);
```

> For a more flexible OAuth 2.0 client, see [`oslo/oauth2`](http://github.com/pilcrowonpaper/oslo).

## Supported providers

- Apple
- Atlassian
- Auth0
- Bitbucket
- Box
- Discord
- Dropbox
- Facebook
- Figma
- Github
- GitLab
- Google
- Kakao
- Keycloak
- Line
- LinkedIn
- Microsoft Entra ID
- Naver
- Notion
- Reddit
- Salesforce
- Spotify
- Tumblr
- Twitch
- Twitter
- Yahoo
