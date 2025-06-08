import { scrapeWebpageAsElement } from '../lib';
import { FabricData, ProjectData } from './contracts';

export async function getFabricDetails(
	url: string,
): Promise<FabricData | null> {
	const $ = await scrapeWebpageAsElement(url);

	// The Joann website encodes the product (fabric) data in a script tag with
	// id `mobify-data`. Extract the data and parse it as JSON.
	const embeddedJsonRaw = $('#mobify-data').text();
	const embeddedJson = JSON.parse(embeddedJsonRaw);
	const queries = embeddedJson?.__PRELOADED_STATE__?.__reactQuery?.queries;

	if (!queries) {
		return null;
	}

	let data: FabricData | null = null;

	for (const query of queries) {
		const fabricDetails = query?.state?.data;

		if (fabricDetails?.c_pdpSchemaOrg) {
			data = {
				__source: fabricDetails,
				rating: fabricDetails.c_bvAverageRating,
				ratingCount: +fabricDetails.c_bvReviewCount,
				ratingMax: +fabricDetails.c_bvRatingRange,
				category: {
					externalId: fabricDetails.c_categoryNumber,
					name: fabricDetails.c_categoryDescription,
				},
				materials: fabricDetails.c_content,
				dimensionLimits: fabricDetails.c_ecommerceWidth,
				fabricCare: fabricDetails.c_fabricCare,
				_fabricMaterial: fabricDetails.c_fabricContent,
				keywords: fabricDetails.c_keywords,
				merchCategory: {
					externalId: fabricDetails.c_merchandiseCategoryNumber,
					name: fabricDetails.c_merchandiseCategoryDescription,
				},
				relativeUrl: fabricDetails.c_pageMeta.canonicalUrl,
				openGraphImage: fabricDetails.c_pageMeta.openGraph.image,
				description: fabricDetails.c_pdpSchemaOrg.description,
				mainImageUrl: fabricDetails.c_pageMeta.image,
				name: fabricDetails.c_pdpSchemaOrg.name,
				itemNumber: fabricDetails.c_pdpSchemaOrg.sku,
				url: fabricDetails.c_pdpSchemaOrg.url,
				basePrice: fabricDetails?.c_price?.basePrice,
				discountPrice: fabricDetails?.c_price?.discountPrice,
				fabricWidth: +fabricDetails.c_width,
				externalId: fabricDetails.id + '',
				images: [],
				manufacturerSku: fabricDetails.manufacturerSku,
			} as FabricData;

			for (const imgGrp of fabricDetails.imageGroups) {
				for (const img of imgGrp.images) {
					data.images.push({
						url: img.disBaseLink,
						alt: img.title,
					});
					data.images.push({
						url: img.link,
						alt: img.title,
					});
				}
			}

			break;
		}
	}

	return data;
}

export async function getProjectDetails(url: string): Promise<ProjectData | null> {
	const $ = await scrapeWebpageAsElement(url);

	const embeddedJsonRaw = $('.pdp-main').attr('data-initial-state-product');

	if (!embeddedJsonRaw) {
		return null;
	}

	const parsedData = JSON.parse(embeddedJsonRaw);
	const project: Partial<ProjectData> = {
		__source: parsedData,
		name: parsedData.productName,
		itemNumber: parsedData.id,
		description: parsedData.shortDescription,
		images: parsedData.images,
	};

	for (const attrGrp of parsedData.attributes) {
		if (attrGrp.ID === 'joannCustomProject') {
			for (const attr of attrGrp.attributes) {
				if (attr.ID === 'craftingTime') {
					project.craftingTime = attr.value[0];
				}
				if (attr.ID === 'skillLevel') {
					project.skillLevel = attr.value[0];
				}
				if (attr.ID === 'disclaimer') {
					project.disclaimer = attr.value[0];
				}
				if (attr.ID === 'pdfPath') {
					project.pdfPath = attr.value[0];
				}
				if (attr.ID === 'projectClassKeywords') {
					project.keywords = attr.value[0]
						.split(',')
						.map((k: string) => k.trim());
				}
			}

			break;
		}
	}

	return project as ProjectData;
}
