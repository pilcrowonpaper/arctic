import type { OAuth2Tokens } from "./oauth2.js";

export interface OAuth2AuthorizationOptions {
	state?: string;
	scopes?: string[];
	codeVerifier?: string;
}

export interface OAuth2ValidationOptions {
	code?: string;
	codeVerifier?: string;
	scopes?: string[];
}

type TupleToUnion<T extends readonly unknown[]> = T[number];

export interface OAuth2Provider<
	TAuth extends readonly (keyof OAuth2AuthorizationOptions)[] = readonly (keyof OAuth2AuthorizationOptions)[],
	TValidation extends readonly (keyof OAuth2ValidationOptions)[] = readonly (keyof OAuth2ValidationOptions)[]
> {
	createAuthorizationURL(options: Pick<OAuth2AuthorizationOptions, TupleToUnion<TAuth>>): URL;
	validateAuthorizationCode(options: Pick<OAuth2ValidationOptions, TupleToUnion<TValidation>>): Promise<OAuth2Tokens>;
}
