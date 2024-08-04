import {
	ApiClient,
	SearchFilter,
	SearchOptions,
	SortBy,
} from '../adapters/Joann';
import { IQueryBuilder } from '../contracts';
import { FabricSearchResult } from './FabricSearchResult';

export class FabricSearchQuery implements IQueryBuilder<FabricSearchResult> {
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
}
