export class ApiClient {
	private readonly GRAPHQL_ENDPOINT = 'https://simplicity.com/graphql';
	private readonly TOKEN_PAGE = 'https://simplicity.com/simplicity-patterns';

	private static instance: ApiClient;

	private authBearerToken: string | null = null;

	/**
	 * Enforce the use of a singleton.
	 *
	 * @see ApiClient.getInstance()
	 */
	private constructor() {}

	async init(force: boolean = false) {
		if (this.authBearerToken === null || force) {
			await this.scrapeCsrfToken();
		}

		return this;
	}

	async executeGraphQL<T = object>(query: string): Promise<T> {
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

	static getInstance() {
		if (!ApiClient.instance) {
			this.instance = new ApiClient();
		}

		return this.instance;
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
