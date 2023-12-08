export function getOriginFromDomain(domain: string): string {
	if (domain.startsWith("http://") || domain.startsWith("https://")) {
		return domain;
	}
	return "https://" + domain;
}
