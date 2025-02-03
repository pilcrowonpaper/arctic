
import { OAuth2Tokens } from "../oauth2.js";
import { OAuth2Client } from "../client.js";
import { joinURIAndPath } from "../request.js";

export class Gitea {
    private authorizationEndpoint: string;
    private tokenEndpoint: string;

    private client: OAuth2Client;

    constructor(baseURL: string, clientId: string, clientSecret: string | null, redirectURI: string) {
        this.authorizationEndpoint = joinURIAndPath(baseURL, "/login/oauth/authorize");
        this.tokenEndpoint = joinURIAndPath(baseURL, "/login/oauth/access_token");
        this.client = new OAuth2Client(clientId, clientSecret, redirectURI);
    }

    public createAuthorizationURL(state: string, scopes: string[]): URL {
        const url = this.client.createAuthorizationURL(this.authorizationEndpoint, state, scopes);
        return url;
    }

    public async validateAuthorizationCode(code: string): Promise<OAuth2Tokens> {
        const tokens = await this.client.validateAuthorizationCode(this.tokenEndpoint, code, null);
        return tokens;
    }

    public async refreshAccessToken(refreshToken: string): Promise<OAuth2Tokens> {
        const tokens = await this.client.refreshAccessToken(this.tokenEndpoint, refreshToken, []);
        return tokens;
    }
}