import { scrapeWebpageAsText } from '../../utilities/scraping';
import { objToQueryParams } from '../../utilities/url';
import { JoannResponse } from '../Joann/';
import { SearchOptions } from './searchConstants';

const SEARCH_ENDPOINT = 'https://ac.cnstrc.com/search/{searchTerm}';
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

export async function searchFabrics(csrfToken: string, options: SearchOptions) {
	const baseURL = SEARCH_ENDPOINT.replace('{searchTerm}', options.term ?? '');
	const searchQuery = new URL(baseURL);

	searchQuery.search = new URLSearchParams({
		...objToQueryParams(options, ['term']),
		key: csrfToken,
	}).toString();

	const response = await fetch(searchQuery);

	return (await response.json()) as JoannResponse;
}
