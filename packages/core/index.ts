import { ApiClient } from './src/graphql/ApiClient';
import { SearchQuery } from './src/graphql/SearchQuery';

(async function () {
	const client = ApiClient.getInstance();
	await client.init();

	const searchQuery = new SearchQuery().includeOutOfStock(true);

	const response = await searchQuery.execute();

	for (const product of response.getResults()) {
		console.log(product.name, '-', product.brand.name, '-', product.images);
	}
})();
