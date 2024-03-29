import { OAuth2Client } from "oslo/oauth2";
import type { OAuth2Provider, Tokens } from "../index.js";

const authorizeEndpoint = "https://shikimori.one/oauth/authorize";
const tokenEndpoint = "https://shikimori.one/oauth/token";

export interface ShikimoriTokens {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  created_at: number;  
}

export class Shikimori implements OAuth2Provider {
  private client: OAuth2Client;
  private clientSecret: string;

  constructor(clientId: string, clientSecret: string, redirectURI: string) {
    this.client = new OAuth2Client(clientId, authorizeEndpoint, tokenEndpoint, {
      redirectURI
    });
    this.clientSecret = clientSecret;
  }

  createAuthorizationURL(state: string): Promise<URL> {
    return this.client.createAuthorizationURL({ state });
  }
  
  async validateAuthorizationCode(code: string): Promise<Tokens> {
    const result = await this.client.validateAuthorizationCode<ShikimoriTokens>(code, {
      authenticateWith: "request_body",
      credentials: this.clientSecret
    });
  
    return {
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
      accessTokenExpiresAt: new Date((result.created_at + result.expires_in) * 1000),
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<Tokens> {
    const result = await this.client.refreshAccessToken<ShikimoriTokens>(refreshToken, {
      authenticateWith: "request_body",
      credentials: this.clientSecret
    });

    return {
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
      accessTokenExpiresAt: new Date((result.created_at + result.expires_in) * 1000),
    };
  }
}
