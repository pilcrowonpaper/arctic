export { Apple } from "./providers/apple.js";
export { Atlassian } from "./providers/atlassian.js";
export { Auth0 } from "./providers/auth0.js";
export { Bitbucket } from "./providers/bitbucket.js";
export { Box } from "./providers/box.js";
export { Discord } from "./providers/discord.js";
export { Dropbox } from "./providers/dropbox.js";
export { Facebook } from "./providers/facebook.js";
export { Figma } from "./providers/figma.js";
export { GitHub } from "./providers/github.js";
export { Google } from "./providers/google.js";
export { Kakao } from "./providers/kakao.js";
export { Keycloak } from "./providers/keycloak.js";
export { Line } from "./providers/line.js";
export { LinkedIn } from "./providers/linkedin.js";
export { MicrosoftEntraID } from "./providers/microsoft-entra-id.js";
export { Naver } from "./providers/naver.js";
export { Notion } from "./providers/notion.js";
export { Reddit } from "./providers/reddit.js";
export { Slack } from "./providers/slack.js";
export { Spotify } from "./providers/spotify.js";
export { Twitch } from "./providers/twitch.js";
export { Twitter } from "./providers/twitter.js";
export { Yahoo } from "./providers/yahoo.js";

export type { AppleCredentials, AppleRefreshedTokens, AppleTokens } from "./providers/apple.js";
export type { AtlassianTokens, AtlassianUser } from "./providers/atlassian.js";
export type { Auth0Tokens, Auth0User } from "./providers/auth0.js";
export type {
	BitbucketLink,
	BitbucketLinks,
	BitbucketTokens,
	BitbucketUser
} from "./providers/bitbucket.js";
export type { BoxTokens, BoxUser } from "./providers/box.js";
export type { DiscordTokens, DiscordUser } from "./providers/discord.js";
export type { DropboxRefreshedTokens, DropboxTokens, DropboxUser } from "./providers/dropbox.js";
export type { FacebookTokens, FacebookUser } from "./providers/facebook.js";
export type { FigmaRefreshedTokens, FigmaTokens, FigmaUser } from "./providers/figma.js";
export type {
	GitHubTokens,
	GitHubUser,
	PrivateGitHubUser,
	PublicGitHubUser
} from "./providers/github.js";
export type { GitLabTokens, GitLabUser } from "./providers/gitlab.js";
export type { GoogleRefreshedTokens, GoogleTokens, GoogleUser } from "./providers/google.js";
export type {
	KakaoAccount,
	KakaoPartner,
	KakaoProfile,
	KakaoTokens,
	KakaoUser
} from "./providers/kakao.js";
export type { KeycloakTokens, KeycloakUser } from "./providers/keycloak.js";
export type { LineRefreshedTokens, LineTokens, LineUser } from "./providers/line.js";
export type { LinkedInTokens, LinkedInUser } from "./providers/linkedin.js";
export type {
	MicrosoftEntraIDTokens,
	MicrosoftEntraIDUser
} from "./providers/microsoft-entra-id.js";
export type { NaverTokens, NaverUser, NaverUserResponse } from "./providers/naver.js";
export type { NotionPersonUser, NotionTokens, NotionUser } from "./providers/notion.js";
export type { RedditTokens, RedditUser } from "./providers/reddit.js";
export type { SlackTokens, SlackUser } from "./providers/slack.js";
export type { SpotifyTokens, SpotifyUser } from "./providers/spotify.js";
export type { TumblrTokens, TumblrUser, TumblrBlog } from "./providers/tumblr.js";
export type { TwitchTokens, TwitchUser } from "./providers/twitch.js";
export type { TwitterTokens, TwitterUser } from "./providers/twitter.js";
export type { YahooTokens, YahooUser } from "./providers/yahoo.js";

export { generateCodeVerifier, generateState, OAuth2RequestError } from "oslo/oauth2";

export interface OAuth2Provider {
	createAuthorizationURL(state: string): Promise<URL>;
	validateAuthorizationCode(code: string): Promise<Tokens>;
	refreshAccessToken?(refreshToken: string): Promise<Tokens>;
	getUser?(accessToken: string): Promise<{}>;
}

export interface OAuth2ProviderWithPKCE {
	createAuthorizationURL(codeVerifier: string): Promise<URL>;
	validateAuthorizationCode(code: string, codeVerifier: string): Promise<Tokens>;
	refreshAccessToken?(refreshToken: string): Promise<Tokens>;
	getUser?(accessToken: string): Promise<{}>;
}

export interface Tokens {
	accessToken: string;
}
