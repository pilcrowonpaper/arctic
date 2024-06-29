# arctic

## 2.0.0-next.0

## Major changes

- `createAuthorizationURL()` no longer returns a `Promise`
- `validateAuthorizationCode()` and `refreshAccessToken()` returns `OAuth2Tokens`
- `validateAuthorizationCode()` and `refreshAccessToken()` can throw one of `OAuth2RequestError`, `ArcticFetchError`, or `Error`
- Scopes are no longer set by default, including `openid` and those required by the provider
- Updated parameters for `Apple`, `GitHub`, `GitLab`, `MicrosoftEntraId`, `MyAnimeList`, `Okta`, `Osu`, and `Salesforce`
- Removed `options.scope` parameter from `createAuthorizationURL()`
- Removed `OAuth2Provider` and `OAuth2ProviderWithPKCE`
- Replace `Slack` with `SlackApp` and `SlackOpenID`
- Remove `Keycloak`

## Minor changes

- Add `refreshAccessToken()` to `GitHub`
- `createAuthorizationURL()` returns `AuthorizationCodeAuthorizationURL`
- Add `decodeIdToken()`
- Add token revocation API
