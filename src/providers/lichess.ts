import { OAuth2Client } from "oslo/oauth2";
import type { OAuth2ProviderWithPKCE } from "../index.js";

const authorizeEndpoint = "https://lichess.org/oauth";
const tokenEndpoint = "https://lichess.org/api/token";

export class Lichess implements OAuth2ProviderWithPKCE {
	private client: OAuth2Client;

	constructor(clientId: string, redirectURI: string) {
		this.client = new OAuth2Client(clientId, authorizeEndpoint, tokenEndpoint, {
			redirectURI
		});
	}

	public async createAuthorizationURL(
		state: string,
		codeVerifier: string,
		options?: {
			scopes?: string[];
		}
	): Promise<URL> {
		return await this.client.createAuthorizationURL({
			state,
			scopes: options?.scopes ?? [],
			codeVerifier
		});
	}

	public async validateAuthorizationCode(
		code: string,
		codeVerifier: string
	): Promise<LichessTokens> {
		const result = await this.client.validateAuthorizationCode(code, {
			authenticateWith: "request_body",
			codeVerifier
		});
		const tokens: LichessTokens = {
			accessToken: result.access_token
		};
		return tokens;
	}
}

export interface LichessTokens {
	accessToken: string;
}

export interface LichessUser {
	id: string;
	username: string;
	perfs: {
		chess960: ChessGameStats;
		antichess: ChessGameStats;
		puzzle: ChessGameStats;
		atomic: ChessGameStats;
		racingKings: ChessGameStats;
		racer: {
			runs: number;
			score: number;
		};
		ultraBullet: ChessGameStats;
		blitz: ChessGameStats;
		kingOfTheHill: ChessGameStats;
		crazyhouse: ChessGameStats;
		threeCheck: ChessGameStats;
		streak: {
			runs: number;
			score: number;
		};
		storm: {
			runs: number;
			score: number;
		};
		bullet: ChessGameStats;
		correspondence: ChessGameStats;
		classical: ChessGameStats;
		rapid: ChessGameStats;
	};
	patron: boolean;
	createdAt: number;
	profile: {
		location: string;
		firstName: string;
		flag: string;
		bio: string;
		lastName: string;
		links: string;
	};
	seenAt: number;
	playTime: {
		total: number;
		tv: number;
	};
	url: string;
	count: {
		all: number;
		rated: number;
		ai: number;
		draw: number;
		drawH: number;
		loss: number;
		lossH: number;
		win: number;
		winH: number;
		bookmark: number;
		playing: number;
		import: number;
		me: number;
	};
	followable: boolean;
	following: boolean;
	blocking: boolean;
	followsYou: boolean;
}

export interface ChessGameStats {
	games: number;
	rating: number;
	rd: number;
	prog: number;
	prov?: boolean;
}
