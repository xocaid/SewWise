import { stringify } from 'jsonlines';
import { createWriteStream } from 'node:fs';

import { FabricSearchQuery, FabricSearchResult } from './src';

(async function () {
	// const patternSearch = new PatternSearchQuery();
	// const patternResponse = await patternSearch.includeOutOfStock(true).execute();
	//
	// console.log(JSON.stringify(patternResponse.products));

	const fabricQuery = new FabricSearchQuery();
	let fabricResponse: FabricSearchResult | undefined = await fabricQuery
		.numberOfResults(36)
		.execute();

	const writeStream = createWriteStream('fabrics.jsonl', { flags: 'w' });
	const stringifier = stringify();
	stringifier.pipe(writeStream);

	while (fabricResponse !== undefined) {
		for (const fabric of fabricResponse.results) {
			stringifier.write(fabric);
		}

		fabricResponse = await fabricResponse.nextPage();
		process.stdout.write('.');
	}

	stringifier.end();
	console.log('Done!');
})();
