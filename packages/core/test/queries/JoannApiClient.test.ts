import { Filter } from '../../src/contracts/JoannSearch';
import { getCsrfToken, searchFabrics } from '../../src/queries/JoannApi';
import { JoannApiClient } from '../../src/queries/JoannApiClient';
import { getMockSearchResult } from '../utilities';

import mocked = jest.mocked;

jest.mock('../../src/queries/JoannApi');

describe('JoannApiClient', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should correctly be able to load options for HowToGetIt filter', async () => {
		mocked(getCsrfToken).mockReturnValueOnce(Promise.resolve('key_123'));
		mocked(searchFabrics).mockReturnValueOnce(
			Promise.resolve(getMockSearchResult()),
		);

		const client = await JoannApiClient.getInstance();
		const options = await client.getOptionsForFilter(Filter.HowToGetIt);

		expect(options).toEqual(['FREE curbside & pick-up', 'Ship to me']);
	});
});
