import { FabricSearchQuery } from '../../queries/FabricSearchQuery';
import {
	FabricSearchResult,
	FabricSearchResultMetadata,
} from '../../queries/FabricSearchResult';
import { getCsrfToken, searchFabrics } from './JoannApi';
import { Filter, JoannSearchOptions } from './JoannSearchOptions';

export class JoannApiClient {
	private static instance: JoannApiClient;

	private cachedMetadata: FabricSearchResultMetadata | null = null;
	private csrfToken: string | null = null;

	private constructor() {}

	async init(force: boolean = false) {
		if (this.csrfToken === null || force) {
			await this.refreshToken();
		}

		return this;
	}

	async search(options: JoannSearchOptions) {
		this.assertInitialized();

		return new FabricSearchResult(
			await searchFabrics(this.csrfToken!, options),
		);
	}

	async refreshToken() {
		this.csrfToken = await getCsrfToken();
	}

	async getOptionsForFilter(filter: Filter) {
		await this.cacheSearchMetadata();
		this.assertMetadataIsCached();

		const facet = this.cachedMetadata!.filters.find((f) => f.name === filter);

		if (!facet) {
			throw new Error(`No such filter exists: ${filter}`);
		}

		return facet.options.map((option) => option.value);
	}

	static async getInstance() {
		if (!JoannApiClient.instance) {
			this.instance = new JoannApiClient();
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
