import { FabricSearchQuery, Joann, PatternSearchQuery } from './src';
import { SearchFilter } from './src/adapters/Joann';

(async function () {
	const patternSearch = new PatternSearchQuery();
	const patternResponse = await patternSearch.includeOutOfStock(true).execute();

	console.log(JSON.stringify(patternResponse.products));

	const fabricApi = await Joann.ApiClient.getInstance();
	const fabricOptions = await fabricApi.getOptionsForFilter(SearchFilter.Color);

	const fabricSearch = new FabricSearchQuery();
	fabricSearch.applyFilter(SearchFilter.Color, fabricOptions[0]);

	const fabricResponse = await fabricSearch.execute();

	console.log(JSON.stringify(fabricResponse.results));
})();
