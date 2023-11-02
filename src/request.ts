export async function sendRequest<_ResponseBody extends {}>(
	request: Request
): Promise<_ResponseBody> {
	request.headers.set("Accept", "application/json");
	const response = await fetch(request);
	if (!response.ok) {
		throw new RequestError(request, response);
	}
	return await response.json();
}

export class RequestError extends Error {
	public request: Request;
	public response: Response;
	constructor(request: Request, response: Response) {
		super("request failed");
		this.request = request;
		this.response = response;
	}
}
