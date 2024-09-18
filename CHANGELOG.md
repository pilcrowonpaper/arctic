# arctic

## 2.0.0-next.9

### Patch changes

- Remove `@oslojs/oauth2` dependency.

## 2.0.0-next.8

### Minor changes

- Add Polar provider.
- Add Start.gg provider.
- Add Bungie.Net provider.

## 2.0.0-next.7

### Patch changes

- Update dependencies

## 2.0.0-next.6

### Major changes

- Remove `OAuth2Tokens.refreshTokenExpiresInSeconds()` and `OAuth2Tokens.refreshTokenExpiresAt()`

## 2.0.0-next.5

### Minor changes

- Export `decodeIdToken()`

## 2.0.0-next.4

### Patch changes

- Fix `createAuthorizationURL()` methods.

## 2.0.0-next.2

### Major changes

- Update `createAuthorizationURL()` provider methods
- Remove `SlackApp` and `SlackOpenID`

## 2.0.0-next.1

### Minor changes

- Add KeyCloak provider

### Patch changes

- Fix token endpoint initialization in `Salesforce` provider

## 2.0.0-next.0

### Major changes

- `createAuthorizationURL()` no longer returns a `Promise`
- `validateAuthorizationCode()` and `refreshAccessToken()` returns `OAuth2Tokens`
- `validateAuthorizationCode()` and `refreshAccessToken()` can throw one of `OAuth2RequestError`, `ArcticFetchError`, or `Error`
- Scopes are no longer set by default, including `openid` and those required by the provider
- Updated parameters for `Apple`, `GitHub`, `GitLab`, `MicrosoftEntraId`, `MyAnimeList`, `Okta`, `Osu`, and `Salesforce`
- Removed `options.scope` parameter from `createAuthorizationURL()`
- Removed `OAuth2Provider` and `OAuth2ProviderWithPKCE`
- Replace `Slack` with `SlackApp` and `SlackOpenID`
- Remove `Keycloak`

### Minor changes

- Add `refreshAccessToken()` to `GitHub`
- `createAuthorizationURL()` returns `AuthorizationCodeAuthorizationURL`
- Add `decodeIdToken()`
- Add token revocation API
