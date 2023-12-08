export { Apple } from "./providers/apple.js";
export { MicrosoftEntraID } from "./providers/microsoft-entra-id.js";
export { Discord } from "./providers/discord.js";
export { Facebook } from "./providers/facebook.js";
export { GitHub } from "./providers/github.js";
export { Google } from "./providers/google.js";
export { Line } from "./providers/line.js";
export { LinkedIn } from "./providers/linkedin.js";
export { Spotify } from "./providers/spotify.js";
export { Twitch } from "./providers/twitch.js";
export { Twitter } from "./providers/twitter.js";

export type {
	AppleCredentials,
	AppleIdTokenClaims,
	AppleRefreshedTokens,
	AppleTokens
} from "./providers/apple.js";
export type {
	MicrosoftEntraIDIdTokenClaims,
	MicrosoftEntraIDTokens,
	MicrosoftEntraIDUser
} from "./providers/microsoft-entra-id.js";
export type { DiscordTokens, DiscordUser } from "./providers/discord.js";
export type { FacebookTokens, FacebookUser } from "./providers/facebook.js";
export type {
	GitHubTokens,
	GitHubUser,
	PrivateGitHubUser,
	PublicGitHubUser
} from "./providers/github.js";
export type { GoogleRefreshedTokens, GoogleTokens, GoogleUser } from "./providers/google.js";
export type {
	LineIdTokenClaims,
	LineRefreshedTokens,
	LineTokens,
	LineUser
} from "./providers/line.js";
export type { LinkedInTokens, LinkedInUser } from "./providers/linkedin.js";
export type { SpotifyTokens, SpotifyUser } from "./providers/spotify.js";
export type { TwitchTokens, TwitchUser } from "./providers/twitch.js";
export type { TwitterTokens, TwitterUser } from "./providers/twitter.js";

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
