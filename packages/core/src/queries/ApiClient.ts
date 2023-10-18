import {
	ApolloClient,
	ApolloQueryResult,
	createHttpLink,
	DocumentNode,
	InMemoryCache,
	OperationVariables,
} from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';

export class ApiClient {
	private readonly GRAPHQL_ENDPOINT = 'https://simplicity.com/graphql';
	private readonly TOKEN_PAGE = 'https://simplicity.com/simplicity-patterns';

	private static instance: ApiClient;

	private client: ApolloClient<any> | null = null;
	private authBearerToken: string | null = null;

	/**
	 * Enforce the use of a singleton.
	 *
	 * @see ApiClient.getInstance()
	 */
	private constructor() {}

	async init(force: boolean = false) {
		if (this.authBearerToken === null || force) {
			await this.refreshToken();
		}

		this.createApolloClient();

		return this;
	}

	async executeGraphQL<T, V extends OperationVariables>(
		query: DocumentNode,
		variables?: V,
	): Promise<ApolloQueryResult<T>> {
		if (!this.client) {
			throw new Error('No client configured');
		}

		return await this.client.query<T, V>({
			query,
			variables,
		});
	}

	async refreshToken() {
		await this.scrapeCsrfToken();
	}

	static getInstance() {
		if (!ApiClient.instance) {
			this.instance = new ApiClient();
		}

		return this.instance;
	}

	private createApolloClient() {
		const httpLink = createHttpLink({
			uri: this.GRAPHQL_ENDPOINT,
		});

		const authLink = setContext((_, { headers }) => ({
			headers: {
				...headers,
				authorization: this.authBearerToken
					? `Bearer ${this.authBearerToken}`
					: '',
			},
		}));

		this.client = new ApolloClient({
			cache: new InMemoryCache(),
			link: authLink.concat(httpLink),
		});
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
