import {
	ApiClient,
	SearchFilter,
	SearchOptions,
	SortBy,
} from '../adapters/Joann';
import { IQueryBuilder } from '../contracts';
import {
	FabricSearchResult,
	FabricSearchResultMetadata,
} from './FabricSearchResult';

export class FabricSearchQuery implements IQueryBuilder<FabricSearchResult> {
	private static cachedMetadata: FabricSearchResultMetadata | null = null;
	private searchFilter: SearchOptions = {
		filters: {},
	};

	async execute(): Promise<FabricSearchResult> {
		const client = await ApiClient.getInstance();

		return await client.search(this.searchFilter);
	}

	applyFilter(filter: SearchFilter, value: number | string): this {
		this.searchFilter.filters[filter] = value;

		return this;
	}

	getPage(page: number): this {
		this.searchFilter.page = page;

		return this;
	}

	numberOfResults(numResults: number): this {
		this.searchFilter.num_results_per_page = numResults;

		return this;
	}

	searchTerm(term: string): this {
		this.searchFilter.term = term;

		return this;
	}

	sortBy(sortBy: SortBy, ascending: boolean): this {
		this.searchFilter.sort_by = sortBy;
		this.searchFilter.sort_order = ascending ? 'ascending' : 'descending';

		return this;
	}

	// findById(id: string): string {
	// 	const $ = scrapeWebpageAsElement(
	// 		'https://www.joann.com/sew-classic-solid-cotton-fabric/zprd_17020546a.html',
	// 	);
	// }

	static async getFilters() {
		await this.cacheSearchMetadata();

		return this.cachedMetadata!.filters.map((f) => f.name);
	}

	static async getFiltersMetadata(filter: SearchFilter) {
		await this.cacheSearchMetadata();

		return this.cachedMetadata!.filters.find((f) => f.name === filter);
	}

	static async getOptionsForFilter(filter: SearchFilter) {
		await this.cacheSearchMetadata();

		const facet = this.cachedMetadata!.filters.find((f) => f.name === filter);

		if (!facet) {
			throw new Error(`No such filter exists: ${filter}`);
		}

		return facet.options.map((option) => option.value);
	}

	private static async cacheSearchMetadata(force: boolean = false) {
		if (this.cachedMetadata && !force) {
			return;
		}

		const q = new FabricSearchQuery();
		const result = await q.numberOfResults(1).execute();

		this.cachedMetadata = result.metadata;

		if (!this.cachedMetadata) {
			throw new Error('Search metadata not cached');
		}
	}
}
