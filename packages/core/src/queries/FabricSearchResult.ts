import { JoannResponse } from '../adapters/Joann';
import { FabricSearchQuery } from './FabricSearchQuery';

export class FabricSearchResult {
	constructor(
		private readonly response: JoannResponse,
		private readonly query: FabricSearchQuery,
	) {}

	get metadata() {
		return {
			total: this.response.response.total_num_results,
			filters: this.response.response.facets,
			categories: this.response.response.groups,
			sortOptions: this.response.response.sort_options,
		};
	}

	get results() {
		return this.response.response.results;
	}

	get currentPage() {
		return this.response.request.page;
	}

	async nextPage() {
		if (!this.hasMorePages) {
			return undefined;
		}

		this.query.getPage(this.currentPage + 1);

		return this.query.execute();
	}

	get hasMorePages() {
		return this.currentPage < this.totalPageCount;
	}

	get totalResults() {
		return this.response.response.total_num_results;
	}

	get totalPageCount() {
		return Math.ceil(
			this.response.response.total_num_results /
				this.response.request.num_results_per_page,
		);
	}
}

export type FabricSearchResultMetadata =
	typeof FabricSearchResult.prototype.metadata;
