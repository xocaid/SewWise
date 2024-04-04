import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { JoannResponse } from '../src/contracts/JoannResponse';

export function getMockSearchResult(): JoannResponse {
	const file = readFileSync(
		resolve(__dirname, '../resources/joann-search-response.json'),
		'utf-8',
	);

	return JSON.parse(file);
}
