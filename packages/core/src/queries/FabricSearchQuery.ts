import { IQueryBuilder } from '../contracts';
import { Filter, JoannSearchOptions, SortBy } from '../contracts/JoannSearch';
import { FabricSearchResult } from './FabricSearchResult';
import { JoannApiClient } from './JoannApiClient';

export class FabricSearchQuery implements IQueryBuilder<FabricSearchResult> {
	private searchFilter: JoannSearchOptions = {
		filters: {},
	};

	async execute(): Promise<FabricSearchResult> {
		const client = await JoannApiClient.getInstance();

		return await client.search(this.searchFilter);
	}

	applyFilter(filter: Filter, value: number | string): this {
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
