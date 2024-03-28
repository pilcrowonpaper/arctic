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

For a flexible OAuth 2.0 client, see [`oslo/oauth2`](http://github.com/pilcrowonpaper/oslo).

> Arctic only supports providers that strictly follow the OAuth 2.0 spec (including PKCE).

## Semver

Arctic does not strictly follow semantic versioning. While we aim to only introduce breaking changes in major versions, we may introduce breaking changes in a minor update if a provider updates their API in a non-backward compatible way. However, breaking changes will never be introduced in a patch update.

## Supported providers

- Amazon Cognito
- Apple
- Atlassian
- Auth0
- Bitbucket
- Box
- Coinbase
- Discord
- Dribbble
- Dropbox
- Facebook
- Figma
- Github
- GitLab
- Google
- Kakao
- Keycloak
- Lichess
- Line
- Linear
- LinkedIn
- Microsoft Entra ID
- Notion
- Okta
- osu!
- Patreon
- Reddit
- Salesforce
- Spotify
- Strava
- Tumblr
- Twitch
- Twitter
- WorkOS
- Yahoo
- Zoom
