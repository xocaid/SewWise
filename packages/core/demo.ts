import { ProductSearchQuery } from './src';

(async function () {
	const search = new ProductSearchQuery();
	const response = await search.includeOutOfStock(true).execute();

	console.log(JSON.stringify(response.products));
})();
