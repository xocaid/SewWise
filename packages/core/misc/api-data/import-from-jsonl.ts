import { PrismaClient } from '@xocaid/sewwise-dto';
import { parse } from 'jsonlines';
import { createReadStream } from 'node:fs';

interface UglyData {
	Available: boolean;
	'Base Price': number; // [needed]
	'Current Price': number;
	ID: number; // [needed] - a numerical ID for the product (like a database ID)
	IsDisplayableOnSite: boolean;
	'Promo Badge Text': string;
	'Promotion ID': string;
	articleStatus: number;
	articleUnitOfMeasure: string;
	availableForInStorePickup: boolean;
	brand: string;
	bvAverageRating?: number; // [needed]
	bvReviewCount?: number; // [needed]
	categoryDescription: string; // [needed]
	categoryNumber: number; // [needed] - I think this is a UID for the category
	description: string; // [needed] - this has HTML tags
	facets: object[];
	group_ids: string[]; // [needed] - these are equivalent of "tags" used for fabric types
	howToGetIt: string;
	id: string; // [needed] - this ID is a string that's used for URLs
	image_url: string; // [needed] - this is the URL of the main fabric
	isClearance: boolean;
	isFinalSale: boolean;
	isFreeStandardShipping: boolean;
	isInternational: boolean;
	isJoannExclusive: boolean;
	isNew: boolean;
	isOnlineExclusive: boolean;
	isProject: boolean;
	isReplenishable: boolean;
	isSale: boolean;
	isVideo: boolean;
	isWeaveUpProduct: boolean;
	masterBadgeText: string;
	masterType: string;
	master_image_url: string;
	master_product_name: string; // [needed] this is the name of the actual fabric
	master_product_url: string; // [needed] - this is the URL of the actual fabric
	master_rating: number;
	master_review_count: number;
	merchandiseCategoryDescription: string;
	minOrderQuantity: number;
	name: string;
	onlineFlag: boolean;
	productFeatures: string;
	productGroup: string;
	refinementColors: string; // [needed] - what color to categorize the fabric under
	salesChannel: string;
	searchable: boolean;
	searchableIfUnavailableFlag: boolean;
	shippedToHomeMinOrderQuantity: number;
	shipsToStore: boolean;
	specialOffers: string;
	swatch_image_url: string;
	url: string; // [needed] - this is the URL of the fabric
	variationType: string; // [needed] - "simple" or "variant"; when "variant", use the variations array in the parent
	variation_id: string;
}

export interface JSONLData {
	data: UglyData;
	is_slotted: boolean;
	labels: {};
	matched_terms: any[];
	value: string;
	variations: { data: UglyData; value: string }[];
}

const parser = parse();
const prisma = new PrismaClient();

function createOrFind(uglyData: UglyData) {
	return prisma.fabric.upsert({
		where: {
			externalId: uglyData.id,
		},
		update: {},
		create: {
			externalId: uglyData.id,
			itemNumber: uglyData.ID + '',
			url: uglyData.master_product_url,
			name: uglyData.master_product_name,
			description: uglyData.description,
			basePrice: uglyData['Base Price'] ?? -1,
			rating: uglyData.bvAverageRating ?? uglyData.master_rating ?? -1,
			ratingCount: uglyData.bvReviewCount ?? -1,
			ratingMax: 5,
			tags: uglyData.group_ids,
			features: uglyData.productFeatures,
			seller: {
				connectOrCreate: {
					where: {
						name: 'Joann',
					},
					create: {
						name: 'Joann',
					},
				},
			},
			category: {
				connectOrCreate: {
					where: {
						externalId: uglyData.categoryNumber + '',
					},
					create: {
						externalId: uglyData.categoryNumber + '',
						description: uglyData.categoryDescription,
					},
				},
			},
			brand: {
				connectOrCreate: {
					where: {
						name: uglyData.brand || 'Unknown',
					},
					create: {
						name: uglyData.brand || 'Unknown',
					},
				},
			},
		},
	});
}

(async function () {
	// const patternSearch = new PatternSearchQuery();
	// const patternResponse = await patternSearch.includeOutOfStock(true).execute();
	//
	// console.log(JSON.stringify(patternResponse.products));

	let counter = 0;

	parser.on('data', ({ data: uglyData, variations }: JSONLData) => {
		console.log(
			'> Processing',
			counter++,
			uglyData.id,
			uglyData.name,
			uglyData.variationType,
		);

		createOrFind(uglyData).then((fabric) => {
			if (variations == null) {
				return Promise.resolve();
			}

			let hasMessageDisplayed = false;
			const variantPromises: Promise<unknown>[] = [];

			for (let { data: variant } of variations) {
				if (variant.variationType === 'simple') {
					break;
				}

				if (!hasMessageDisplayed) {
					console.log('>> Found variant', variant.refinementColors);
					hasMessageDisplayed = true;
				}

				const variantModelPromise = prisma.fabricVariant.upsert({
					where: {
						externalId: variant.ID + '',
					},
					update: {
						colors: variant.refinementColors?.split('|'),
					},
					create: {
						externalId: variant.ID + '',
						name: variant.name,
						url: variant.url,
						swatchImage: {
							connectOrCreate: {
								where: {
									originalUrl: variant.swatch_image_url,
								},
								create: {
									originalUrl: variant.swatch_image_url,
									relativeUrl: '',
								},
							},
						},
						image: {
							connectOrCreate: {
								where: {
									originalUrl: variant.image_url,
								},
								create: {
									originalUrl: variant.image_url,
									relativeUrl: '',
								},
							},
						},
						fabric: {
							connect: {
								id: fabric.id,
							},
						},
					},
				});

				variantPromises.push(variantModelPromise);
			}

			return Promise.all(variantPromises);
		});
	});

	const files = [
		'fabrics.jsonl',
		'fabrics-Anti-Pill Plush Fleece.jsonl',
		'fabrics-Blizzard Fleece.jsonl',
		'fabrics-calico-cotton.jsonl',
		'fabrics-Fabric Quarter Singles.jsonl',
		'fabrics-flannel.jsonl',
		'fabrics-Keepsake Calico Cotton Fabric.jsonl',
		'fabrics-Kids Licensed Fabric.jsonl',
		'fabrics-Knit Fabric.jsonl',
		'fabrics-License-Cotton.jsonl',
		'fabrics-Novelty Cotton Fabric.jsonl',
		'fabrics-Premium Cotton Fabric.jsonl',
		'fabrics-Quilt Cotton Fabric.jsonl',
		"fabrics-Quilter's Showcase Cotton Fabric.jsonl",
		'fabrics-Super Snuggle Flannel.jsonl',
		'fabrics-Team Cotton.jsonl',
	];

	// files.forEach(file => {
	// 	console.log('>>', file);
	//
	// 	const readStream = createReadStream(file);
	// 	readStream.pipe(parser);
	// })

	const readStream = createReadStream(files[15]);
	readStream.pipe(parser);

	// parser.end();
})().then(() => {
	console.log('Finished.');
});
