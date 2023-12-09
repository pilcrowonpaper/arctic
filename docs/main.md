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

## Guides

- [OAuth 2.0](./oauth2.md)
- [OAuth 2.0 with PKCE](./oauth2-pkce.md)

## Providers

- [Apple](./providers/apple.md)
- [Atlassian](./providers/atlassian.md)
- [Auth0](./providers/auth0.md)
- [Bitbucket](./providers/bitbucket.md)
- [Box](./providers/box.md)
- [Discord](./providers/discord.md)
- [Dropbox](./providers/dropbox.md)
- [Facebook](./providers/facebook.md)
- [Figma](./providers/figma.md)
- [GitHub](./providers/github.md)
- [GitLab](./providers/gitlab.md)
- [Google](./providers/google.md)
- [Kakao](./providers/kakao.md)
- [Keycloak](./providers/keycloak.md)
- [Line](./providers/line.md)
- [LinkedIn](./providers/linkedin.md)
- [Microsoft Entra ID](./providers/microsoft-entra-id.md)
- [Notion](./providers/notion.md)
- [Reddit](./providers/reddit.md)
- [Slack](./providers/slack.md)
- [Spotify](./providers/spotify.md)
- [Twitch](./providers/twitch.md)
- [Twitter](./providers/twitter.md)
- [Yahoo](./providers/yahoo.md)
