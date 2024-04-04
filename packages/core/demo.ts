import { PatternSearchQuery } from './src';
import { FabricSearchQuery } from './src/queries/FabricSearchQuery';

(async function () {
	const patternSearch = new PatternSearchQuery();
	const patternResponse = await patternSearch.includeOutOfStock(true).execute();

	console.log(JSON.stringify(patternResponse.products));

	const fabricSearch = new FabricSearchQuery();
	const fabricResponse = await fabricSearch.findById('123');
})();
