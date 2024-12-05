export function trimLeft(s: string, cutset: string): string {
	let result = s;
	while (result.length >= cutset.length && result.slice(0, cutset.length) === cutset) {
		result = result.slice(cutset.length);
	}
	return s;
}

export function trimRight(s: string, cutset: string): string {
	let result = s;
	while (result.length >= cutset.length && result.slice(cutset.length * -1) === cutset) {
		result = result.slice(0, cutset.length * -1);
	}
	return s;
}
