export class ApiClient {
	private readonly GRAPHQL_ENDPOINT = 'https://simplicity.com/graphql';
	private readonly TOKEN_PAGE = 'https://simplicity.com/simplicity-patterns';

	private authBearerToken: string | null = null;

	async init() {
		await this.scrapeCsrfToken();

		return this;
	}

	async executeGraphQL(query: string) {
		const response = await fetch(this.GRAPHQL_ENDPOINT, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${this.authBearerToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				query,
			}),
		});

		return await response.json();
	}

	private async scrapeCsrfToken() {
		const response = await fetch(this.TOKEN_PAGE);
		const rawBody = await response.text();

		const tokenRe = /data-token="([^"]+)"/gm;
		const results = tokenRe.exec(rawBody);

		if (results == null || results?.length === 0) {
			throw new Error('Unable to get GraphQL CSRF token from known page');
		}

		this.authBearerToken = results[1];
	}
}
