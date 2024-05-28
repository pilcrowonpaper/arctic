export { AmazonCognito } from "./providers/amazon-cognito.js";
export { AniList } from "./providers/anilist.js";
export { Apple } from "./providers/apple.js";
export { Atlassian } from "./providers/atlassian.js";
export { Auth0 } from "./providers/auth0.js";
export { Authentik } from "./providers/authentik.js";
export { Bitbucket } from "./providers/bitbucket.js";
export { Box } from "./providers/box.js";
export { Coinbase } from "./providers/coinbase.js";
export { Discord } from "./providers/discord.js";
export { Dribbble } from "./providers/dribbble.js";
export { Dropbox } from "./providers/dropbox.js";
export { Facebook } from "./providers/facebook.js";
export { Figma } from "./providers/figma.js";
export { Intuit } from "./providers/intuit.js";
export { GitHub } from "./providers/github.js";
export { GitLab } from "./providers/gitlab.js";
export { Google } from "./providers/google.js";
export { Kakao } from "./providers/kakao.js";
export { Keycloak } from "./providers/keycloak.js";
export { Lichess } from "./providers/lichess.js";
export { Line } from "./providers/line.js";
export { Linear } from "./providers/linear.js";
export { LinkedIn } from "./providers/linkedin.js";
export { MicrosoftEntraId } from "./providers/microsoft-entra-id.js";
export { MyAnimeList } from "./providers/myanimelist.js";
export { Notion } from "./providers/notion.js";
export { Okta } from "./providers/okta.js";
export { Osu } from "./providers/osu.js";
export { Patreon } from "./providers/patreon.js";
export { Reddit } from "./providers/reddit.js";
export { Roblox } from "./providers/roblox.js";
export { Salesforce } from "./providers/salesforce.js";
export { Shikimori } from "./providers/shikimori.js";
export { Slack } from "./providers/slack.js";
export { Spotify } from "./providers/spotify.js";
export { Startgg } from "./providers/startgg.js";
export { Strava } from "./providers/strava.js";
export { Tiltify } from "./providers/tiltify.js";
export { Tumblr } from "./providers/tumblr.js";
export { Twitch } from "./providers/twitch.js";
export { Twitter } from "./providers/twitter.js";
export { VK } from "./providers/vk.js";
export { WorkOS } from "./providers/workos.js";
export { Yahoo } from "./providers/yahoo.js";
export { Yandex } from "./providers/yandex.js";
export { Zoom } from "./providers/zoom.js";
export { FortyTwo } from "./providers/42.js";

export type {
	AmazonCognitoRefreshedTokens,
	AmazonCognitoTokens
} from "./providers/amazon-cognito.js";
export type { AniListTokens } from "./providers/anilist.js";
export type { AppleCredentials, AppleRefreshedTokens, AppleTokens } from "./providers/apple.js";
export type { AtlassianTokens } from "./providers/atlassian.js";
export type { Auth0Tokens } from "./providers/auth0.js";
export type { AuthentikTokens } from "./providers/authentik.js";
export type { BitbucketTokens } from "./providers/bitbucket.js";
export type { BoxTokens } from "./providers/box.js";
export type { CoinbaseTokens } from "./providers/coinbase.js";
export type { DiscordTokens } from "./providers/discord.js";
export type { DribbbleTokens } from "./providers/dribbble.js";
export type { DropboxRefreshedTokens, DropboxTokens } from "./providers/dropbox.js";
export type { FacebookTokens } from "./providers/facebook.js";
export type { FigmaRefreshedTokens, FigmaTokens } from "./providers/figma.js";
export type { IntuitTokens } from "./providers/intuit.js";
export type { GitHubTokens } from "./providers/github.js";
export type { GitLabTokens } from "./providers/gitlab.js";
export type { GoogleRefreshedTokens, GoogleTokens } from "./providers/google.js";
export type { KakaoTokens } from "./providers/kakao.js";
export type { KeycloakTokens } from "./providers/keycloak.js";
export type { LichessTokens } from "./providers/lichess.js";
export type { LineRefreshedTokens, LineTokens } from "./providers/line.js";
export type { LinearTokens } from "./providers/linear.js";
export type { LinkedInTokens } from "./providers/linkedin.js";
export type { MicrosoftEntraIdTokens } from "./providers/microsoft-entra-id.js";
export type { MyAnimeListTokens } from "./providers/myanimelist.js";
export type { NotionTokens } from "./providers/notion.js";
export type { OktaTokens } from "./providers/okta.js";
export type { OsuTokens } from "./providers/osu.js";
export type { PatreonTokens } from "./providers/patreon.js";
export type { RedditTokens } from "./providers/reddit.js";
export type { RobloxTokens } from "./providers/roblox.js";
export type { SalesforceTokens } from "./providers/salesforce.js";
export type { ShikimoriTokens } from "./providers/shikimori.js";
export type { SlackTokens } from "./providers/slack.js";
export type { SpotifyTokens } from "./providers/spotify.js";
export type { StartggTokens } from "./providers/startgg.js";
export type { StravaTokens } from "./providers/strava.js";
export type { TiltifyTokens } from "./providers/tiltify.js";
export type { TumblrTokens } from "./providers/tumblr.js";
export type { TwitchTokens } from "./providers/twitch.js";
export type { TwitterTokens } from "./providers/twitter.js";
export type { VKTokens } from "./providers/vk.js";
export type { WorkOSTokens } from "./providers/workos.js";
export type { YahooTokens } from "./providers/yahoo.js";
export type { YandexTokens } from "./providers/yandex.js";
export type { ZoomTokens } from "./providers/zoom.js";
export type { FortyTwoTokens } from "./providers/42.js";

export { generateCodeVerifier, generateState, OAuth2RequestError } from "oslo/oauth2";

export interface OAuth2Provider {
	createAuthorizationURL(state: string): Promise<URL>;
	validateAuthorizationCode(code: string): Promise<Tokens>;
	refreshAccessToken?(refreshToken: string): Promise<Tokens>;
}

export interface OAuth2ProviderWithPKCE {
	createAuthorizationURL(state: string, codeVerifier: string): Promise<URL>;
	validateAuthorizationCode(code: string, codeVerifier: string): Promise<Tokens>;
	refreshAccessToken?(refreshToken: string): Promise<Tokens>;
}

export interface Tokens {
	accessToken: string;
	refreshToken?: string | null;
	accessTokenExpiresAt?: Date;
	refreshTokenExpiresAt?: Date | null;
	idToken?: string;
}
