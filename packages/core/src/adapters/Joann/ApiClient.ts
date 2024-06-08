import {
	FabricSearchQuery,
	FabricSearchResult,
	FabricSearchResultMetadata,
} from '../../queries';
import { getCsrfToken, searchFabrics } from './apiUtilities';
import { SearchFilter, SearchOptions } from './searchConstants';

export class ApiClient {
	private static instance: ApiClient;

	private cachedMetadata: FabricSearchResultMetadata | null = null;
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

	async getOptionsForFilter(filter: SearchFilter) {
		await this.cacheSearchMetadata();
		this.assertMetadataIsCached();

		const facet = this.cachedMetadata!.filters.find((f) => f.name === filter);

		if (!facet) {
			throw new Error(`No such filter exists: ${filter}`);
		}

		return facet.options.map((option) => option.value);
	}

	static async getInstance() {
		if (!ApiClient.instance) {
			this.instance = new ApiClient();
			await this.instance.init();
		}

		return this.instance;
	}

	private assertMetadataIsCached() {
		if (!this.cachedMetadata) {
			throw new Error('Search metadata not cached');
		}
	}

	private assertInitialized() {
		if (!this.csrfToken) {
			throw new Error(
				'CSRF token not initialized; you must call init() first.',
			);
		}
	}

	private async cacheSearchMetadata(force: boolean = false) {
		if (this.cachedMetadata && !force) {
			return;
		}

		const q = new FabricSearchQuery();
		const result = await q.numberOfResults(1).execute();

		this.cachedMetadata = result.metadata;
	}
}
