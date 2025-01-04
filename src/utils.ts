export function trimLeft(s: string, character: string): string {
	if (character.length !== 1) {
		throw new TypeError("Invalid character string");
	}
	let start = 0;
	while (start < s.length && s[start] === character) {
		start++;
	}
	return s.slice(start);
}

export function trimRight(s: string, character: string): string {
	if (character.length !== 1) {
		throw new TypeError("Invalid character string");
	}
	let end = s.length;
	while (end > 0 && s[end - 1] === character) {
		end--;
	}
	return s.slice(0, end);
}
