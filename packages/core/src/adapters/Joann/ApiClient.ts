import {
	FabricSearchQuery,
	FabricSearchResult,
	FabricSearchResultMetadata,
} from '../../queries';
import { getCsrfToken, searchFabrics } from './apiUtilities';
import { SearchFilter, SearchOptions } from './searchConstants';

export class ApiClient {
	private static instance: ApiClient;

	private csrfToken: string | null = null;

	private constructor() {}

	async init(force: boolean = false) {
		if (this.csrfToken === null || force) {
			await this.refreshToken();
		}

		return this;
	}

	async search(options: SearchOptions) {
		this.assertInitialized();

		return new FabricSearchResult(
			await searchFabrics(this.csrfToken!, options),
		);
	}

	async refreshToken() {
		this.csrfToken = await getCsrfToken();
	}

	static async getInstance() {
		if (!ApiClient.instance) {
			this.instance = new ApiClient();
			await this.instance.init();
		}

		return this.instance;
	}

	private assertInitialized() {
		if (!this.csrfToken) {
			throw new Error(
				'CSRF token not initialized; you must call init() first.',
			);
		}
	}
}
