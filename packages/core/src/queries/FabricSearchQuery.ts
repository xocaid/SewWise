import { first } from 'cheerio/lib/api/traversing';

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

// Magic number as per the Joann API
const MAX_RESULTS_PER_QUERY = 200;

export class FabricSearchQuery implements IQueryBuilder<FabricSearchResult> {
	private static cachedMetadata: FabricSearchResultMetadata | null = null;
	private _searchFilter: SearchOptions = {
		filters: {},
	};

	get searchOptions() {
		return this._searchFilter;
	}

	async execute(): Promise<FabricSearchResult> {
		const client = await ApiClient.getInstance();

		return await client.search(this);
	}

	applyFilter(filter: SearchFilter, value: number | string): this {
		this._searchFilter.filters[filter] = value;

		return this;
	}

	getPage(page: number): this {
		this._searchFilter.page = page;

		return this;
	}

	numberOfResults(numResults: number): this {
		if (numResults > MAX_RESULTS_PER_QUERY) {
			throw new Error(
				`Cannot request more than ${MAX_RESULTS_PER_QUERY} results per query.`,
			);
		}

		this._searchFilter.num_results_per_page = numResults;

		return this;
	}

	searchTerm(term: string): this {
		this._searchFilter.term = term;

		return this;
	}

	sortBy(sortBy: SortBy, ascending: boolean): this {
		this._searchFilter.sort_by = sortBy;
		this._searchFilter.sort_order = ascending ? 'ascending' : 'descending';

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
