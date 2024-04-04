import { load } from 'cheerio';

export async function scrapeWebpageAsText(url: string) {
	const response = await fetch(url);

	return await response.text();
}

export async function scrapeWebpageAsElement(url: string) {
	return load(await scrapeWebpageAsText(url));
}
