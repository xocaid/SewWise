import * as cheerio from 'cheerio';

export async function scrapeWebpageAsText(url: string) {
	const response = await fetch(url);

	return await response.text();
}

export async function scrapeWebpageAsElement(url: string) {
	return cheerio.load(await scrapeWebpageAsText(url));
}
