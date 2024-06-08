import { ApiClient } from '../../src/adapters/Joann/ApiClient';
import { getCsrfToken, searchFabrics } from '../../src/adapters/Joann/JoannApi';
import { SearchFilter } from '../../src/adapters/Joann/searchConstants';
import { getMockSearchResult } from '../utilities';

import mocked = jest.mocked;

jest.mock('../../src/adapters/Joann/JoannApi');

describe('JoannApiClient', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should correctly be able to load options for HowToGetIt filter', async () => {
		mocked(getCsrfToken).mockReturnValueOnce(Promise.resolve('key_123'));
		mocked(searchFabrics).mockReturnValueOnce(
			Promise.resolve(getMockSearchResult()),
		);

		const client = await ApiClient.getInstance();
		const options = await client.getOptionsForFilter(SearchFilter.HowToGetIt);

		expect(options).toEqual(['FREE curbside & pick-up', 'Ship to me']);
	});
});
