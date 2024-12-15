# arctic

## 2.3.2

- Fix MyAnimeList code challenge method.

## 2.3.1

- Fix AWS Cognito client authentication.

## 2.3.0

- Add a generic OAuth 2.0 client.
- Fix token revocation response checks.
- Fix `validateAuthorizationCode()` method in Naver provider.
- [Breaking] Remove `refreshAccessToken()` method from Figma and Strava provider.

## 2.2.2

- Fix MyAnimeList provider.

## 2.2.1

- Fix GitLab provider endpoints.

## 2.2.0

- Add Epic Games provider.
- Add Naver provider.

## 2.1.0

- Add Epic Games provider.

## 2.0.1

- Update README

## 2.0.0

### Major changes

- `createAuthorizationURL()` no longer returns a `Promise`
- `validateAuthorizationCode()` and `refreshAccessToken()` returns `OAuth2Tokens`
- `validateAuthorizationCode()` and `refreshAccessToken()` can throw one of `OAuth2RequestError`, `ArcticFetchError`, or `Error`
- Scopes are no longer set by default, including `openid` and those required by the provider
- Updated parameters for `Apple`, `GitHub`, `GitLab`, `MicrosoftEntraId`, `MyAnimeList`, `Okta`, `Osu`, and `Salesforce`
- Removed `options.scope` parameter from `createAuthorizationURL()`
- Removed `OAuth2Provider` and `OAuth2ProviderWithPKCE`
- Update `createAuthorizationURL()` provider methods

### Minor changes

- Add Polar provider.
- Add Start.gg provider.
- Add Bungie.Net provider.
- Add `refreshAccessToken()` to `GitHub`
- `createAuthorizationURL()` returns `AuthorizationCodeAuthorizationURL`
- Add `decodeIdToken()`
- Add token revocation API

### Patch changes

- Remove `@oslojs/oauth2` dependency
- Fix Amazon Cognito provider
