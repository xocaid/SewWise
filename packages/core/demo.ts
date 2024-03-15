import { PatternSearchQuery } from './src';

(async function () {
	const search = new PatternSearchQuery();
	const response = await search.includeOutOfStock(true).execute();

	console.log(JSON.stringify(response.products));
})();
