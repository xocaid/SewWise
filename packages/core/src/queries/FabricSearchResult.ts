import { JoannResponse } from '../adapters/Joann/JoannResponse';

export class FabricSearchResult {
	constructor(private readonly response: JoannResponse) {}

	get metadata() {
		return {
			total: this.response.response.result_sources.token_match.count,
			filters: this.response.response.facets,
			categories: this.response.response.groups,
			sortOptions: this.response.response.sort_options,
		};
	}

	get results() {
		return this.response.response.results;
	}
}

export type FabricSearchResultMetadata =
	typeof FabricSearchResult.prototype.metadata;
