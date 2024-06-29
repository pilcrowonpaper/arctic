# Arctic

Arctic is a collection of OAuth 2.0 clients for popular providers. It only supports the authorization code grant type and intended to be used server-side. Built on top of the Fetch API, it's light weight, fully-typed, and runtime-agnostic.

```
npm install arctic@next
```

```ts
import { GitHub, generateState } from "arctic";

const github = new GitHub(clientId, clientSecret);

const state = generateState();
const authorizationURL = github.createAuthorizationURL(state);
authorizationURL.addScopes("user:email");

const tokens = await github.validateAuthorizationCode(code);
const accessToken = tokens.accessToken();
```

For a generic OAuth 2.0 client, see [`@oslojs/oauth2`](https://github.com/oslo-project/oauth2).

> Arctic only supports providers that follow the OAuth 2.0 spec (including PKCE and token revocation).

## Semver

Arctic does not strictly follow semantic versioning. While we aim to only introduce breaking changes in major versions, we may introduce them in a minor update if a provider updates their API in a non-backward compatible way. However, they will never be introduced in a patch update.

## Supported providers

- 42 School
- Amazon Cognito
- AniList
- Apple
- Atlassian
- Auth0
- Authentik
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
- Intuit
- Kakao
- Lichess
- Line
- Linear
- LinkedIn
- Microsoft Entra ID
- MyAnimeList
- Notion
- Okta
- osu!
- Patreon
- Reddit
- Roblox
- Salesforce
- Shikimori
- Slack
- Spotify
- Strava
- Tiltify
- Tumblr
- Twitch
- Twitter
- VK
- WorkOS
- Yahoo
- Yandex
- Zoom
