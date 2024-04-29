# arctic

## 1.8.0

### Minor changes

- Feat: Add `idToken` to the return value of LinkedIn's `validateAuthorizationCode(code: string)` ([#105](https://github.com/pilcrowOnPaper/arctic/pull/105))
- Feat: Add Tiltify provider. ([#118](https://github.com/pilcrowOnPaper/arctic/pull/118))

### Patch changes

- Fix: Make `refreshToken` optional for the return value of LinkedIn's `validateAuthorizationCode(code: string)` ([#105](https://github.com/pilcrowOnPaper/arctic/pull/105))

## 1.7.0

### Minor changes

- Add Shikimori provider. ([#95](https://github.com/pilcrowOnPaper/arctic/pull/95))
- Feat: add 42 school provider ([#109](https://github.com/pilcrowOnPaper/arctic/pull/109))

## 1.6.2

### Patch changes

- Use HTTP basic auth for sending client credentials if supported ([#113](https://github.com/pilcrowOnPaper/arctic/pull/113))

## 1.6.1

### Patch changes

- Fix Roblox provider and reverted API changes introduced in 1.6.0 ([#111](https://github.com/pilcrowOnPaper/arctic/pull/111))

## 1.6.0

### Minor changes

- Add Intuit provider. ([#97](https://github.com/pilcrowOnPaper/arctic/pull/97))

### Patch changes

- Fix Roblox provider (see docs for API changes) ([#110](https://github.com/pilcrowOnPaper/arctic/pull/110))

## 1.5.0

### Minor changes

- Add AniList provider. ([#92](https://github.com/pilcrowOnPaper/arctic/pull/92))

## 1.4.0

### Minor changes

- Add MyAnimeList provider. ([#89](https://github.com/pilcrowOnPaper/arctic/pull/89))
- Add Roblox provider. ([#88](https://github.com/pilcrowOnPaper/arctic/pull/88))
- Add VK provider. ([#88](https://github.com/pilcrowOnPaper/arctic/pull/88))

### Patch changes

- Update dependencies. ([#89](https://github.com/pilcrowOnPaper/arctic/pull/89))

## 1.3.0

### Minor changes

- Add Yandex provider. ([#85](https://github.com/pilcrowOnPaper/arctic/pull/85))
- Feat: Add support for Github Enterprise Server to `GitHub` Provider ([#77](https://github.com/pilcrowOnPaper/arctic/pull/77))

## 1.2.1

### Patch changes

- Move `auri` to dev dependencies. ([#75](https://github.com/pilcrowOnPaper/arctic/pull/75))

## 1.2.0

### Minor changes

- Add Dribbble provider ([#69](https://github.com/pilcrowOnPaper/arctic/pull/69))

### Patch changes

- Fix: Export GitLab provider ([#73](https://github.com/pilcrowOnPaper/arctic/pull/73))

## 1.1.6

### Patch changes

- Fix Atlassian refresh token method ([#67](https://github.com/pilcrowOnPaper/arctic/pull/67))

## 1.1.5

### Patch changes

- Fix: Fix wrong refresh token expiration date in Keycloak provider ([#65](https://github.com/pilcrowOnPaper/arctic/pull/65))

## 1.1.4

### Patch changes

- Fix: Fix spotify provider refresh token not being passed the credentials ([#60](https://github.com/pilcrowOnPaper/arctic/pull/60))

## 1.1.3

### Patch changes

- Fix: Use request body for sending credentials in Dropbox provider ([#55](https://github.com/pilcrowOnPaper/arctic/pull/55))

## 1.1.0

- Add Patreon provider [#46](https://github.com/pilcrowOnPaper/arctic/pull/46)
- Add Amazon Cognito provider [#47](https://github.com/pilcrowOnPaper/arctic/pull/47)
- Add Strava provider [#48](https://github.com/pilcrowOnPaper/arctic/pull/48)
- Add osu! provider [#49](https://github.com/pilcrowOnPaper/arctic/pull/49)
- Add Zoom provider [#50](https://github.com/pilcrowOnPaper/arctic/pull/50)
- Add Linear provider [#51](https://github.com/pilcrowOnPaper/arctic/pull/51)
- Add Coinbase provider [#52](https://github.com/pilcrowOnPaper/arctic/pull/52)
- Add WorkOS provider [#53](https://github.com/pilcrowOnPaper/arctic/pull/53)

## 1.0.1

- Fix Atlassian provider
