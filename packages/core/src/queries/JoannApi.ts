import { JoannResponse } from '../contracts/JoannResponse';
import { JoannSearchOptions } from '../contracts/JoannSearch';
import { objToQueryParams } from '../utilities/url';
import { scrapeWebpageAsText } from './scraping';

const SEARCH_ENDPOINT = 'https://search.joann.com/browse/group_id/fabric';
const CSRF_TOKEN_PAGE = 'https://www.joann.com/fabric/';
const CSRF_TOKEN_RE = /"constructorAPIKey":"(key_[^"]+)"/gm;

export async function getCsrfToken() {
	const body = await scrapeWebpageAsText(CSRF_TOKEN_PAGE);
	const match = CSRF_TOKEN_RE.exec(body);

	if (!match) {
		throw new Error('Could not find CSRF token');
	}

	return match[1];
}

export async function searchFabrics(
	csrfToken: string,
	options: JoannSearchOptions,
) {
	const endpoint = new URL(SEARCH_ENDPOINT);

	endpoint.search = new URLSearchParams({
		...objToQueryParams(options),
		key: csrfToken,
	}).toString();

	const response = await fetch(endpoint);

	return (await response.json()) as JoannResponse;
}
