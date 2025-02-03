import {
	ArcticFetchError,
	createOAuth2Request,
	createOAuth2RequestError,
	encodeBasicCredentials,
	UnexpectedErrorResponseBodyError,
	UnexpectedResponseError
} from "../request.js";
import { OAuth2Tokens } from "../oauth2.js";

export class Gitea {
    private authorizationEndpoint: string;
    private tokenEndpoint: string;

    private clientId: string;
	private clientSecret: string;
	private redirectURI: string | null;

    constructor(domain: string, clientId: string, clientSecret: string, redirectURI: string | null) {
		this.clientId = clientId;
		this.clientSecret = clientSecret;
		this.redirectURI = redirectURI;
        this.authorizationEndpoint = `https://${domain}/login/oauth/authorize`;
        this.tokenEndpoint = `https://${domain}/login/oauth/access_token`;
	}

    public createAuthorizationURL(state: string, scopes: string[]): URL {
            const url = new URL(this.authorizationEndpoint);
            url.searchParams.set("response_type", "code");
            url.searchParams.set("client_id", this.clientId);
            url.searchParams.set("state", state);
            if (scopes.length > 0) {
                url.searchParams.set("scope", scopes.join(" "));
            }
            if (this.redirectURI !== null) {
                url.searchParams.set("redirect_uri", this.redirectURI);
            }
            return url;
        }
    
        public async validateAuthorizationCode(code: string): Promise<OAuth2Tokens> {
            const body = new URLSearchParams();
            body.set("grant_type", "authorization_code");
            body.set("code", code);
            if (this.redirectURI !== null) {
                body.set("redirect_uri", this.redirectURI);
            }
            const request = createOAuth2Request(this.tokenEndpoint, body);
            const encodedCredentials = encodeBasicCredentials(this.clientId, this.clientSecret);
            request.headers.set("Authorization", `Basic ${encodedCredentials}`);
            const tokens = await sendTokenRequest(request);
            return tokens;
        }
    
        public async refreshAccessToken(refreshToken: string): Promise<OAuth2Tokens> {
            const body = new URLSearchParams();
            body.set("grant_type", "refresh_token");
            body.set("refresh_token", refreshToken);
            const request = createOAuth2Request(this.tokenEndpoint, body);
            const encodedCredentials = encodeBasicCredentials(this.clientId, this.clientSecret);
            request.headers.set("Authorization", `Basic ${encodedCredentials}`);
            const tokens = await sendTokenRequest(request);
            return tokens;
        }
    }
    
    async function sendTokenRequest(request: Request): Promise<OAuth2Tokens> {
        let response: Response;
        try {
            response = await fetch(request);
        } catch (e) {
            throw new ArcticFetchError(e);
        }
    
        if (response.status !== 200) {
            if (response.body !== null) {
                await response.body.cancel();
            }
            throw new UnexpectedResponseError(response.status);
        }
    
        let data: unknown;
        try {
            data = await response.json();
        } catch {
            throw new UnexpectedResponseError(response.status);
        }
        if (typeof data !== "object" || data === null) {
            throw new UnexpectedErrorResponseBodyError(response.status, data);
        }
        if ("error" in data && typeof data.error === "string") {
            let error: Error;
            try {
                error = createOAuth2RequestError(data);
            } catch {
                throw new UnexpectedErrorResponseBodyError(response.status, data);
            }
            throw error;
        }
        const tokens = new OAuth2Tokens(data);
        return tokens;
}