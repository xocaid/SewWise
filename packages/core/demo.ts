import { PrismaClient } from '@xocaid/sewwise-dto/src/generated'

import { parse } from 'jsonlines';
import { createReadStream } from 'node:fs';

interface UglyData {
	Available: boolean
	"Base Price": number // [needed]
	"Current Price": number
	ID: number // [needed] - a numerical ID for the product (like a database ID)
	IsDisplayableOnSite: boolean
	"Promo Badge Text": string
	"Promotion ID": string
	articleStatus: number
	articleUnitOfMeasure: string
	availableForInStorePickup: boolean
	brand: string
	bvAverageRating?: number // [needed]
	bvReviewCount?: number // [needed]
	categoryDescription: string // [needed]
	categoryNumber: number // [needed] - I think this is a UID for the category
	description: string // [needed] - this has HTML tags
	facets: object[]
	group_ids: string[] // [needed] - these are equivalent of "tags" used for fabric types
	howToGetIt: string
	id: string // [needed] - this ID is a string that's used for URLs
	image_url: string // [needed] - this is the URL of the main fabric
	isClearance: boolean
	isFinalSale: boolean
	isFreeStandardShipping: boolean
	isInternational: boolean
	isJoannExclusive: boolean
	isNew: boolean
	isOnlineExclusive: boolean
	isProject: boolean
	isReplenishable: boolean
	isSale: boolean
	isVideo: boolean
	isWeaveUpProduct: boolean
	masterBadgeText: string
	masterType: string
	master_image_url: string
	master_product_name: string // [needed] this is the name of the actual fabric
	master_product_url: string // [needed] - this is the URL of the actual fabric
	master_rating: number
	master_review_count: number
	merchandiseCategoryDescription: string
	minOrderQuantity: number
	name: string
	onlineFlag: boolean
	productFeatures: string
	productGroup: string
	refinementColors: string // [needed] - what color to categorize the fabric under
	salesChannel: string
	searchable: boolean
	searchableIfUnavailableFlag: boolean
	shippedToHomeMinOrderQuantity: number
	shipsToStore: boolean
	specialOffers: string
	swatch_image_url: string
	url: string // [needed] - this is the URL of the fabric
	variationType: string // [needed] - "simple" or "variant"; when "variant", use the variations array in the parent
	variation_id: string
}

const parser = parse();
const prisma = new PrismaClient();

(async function () {
	// const patternSearch = new PatternSearchQuery();
	// const patternResponse = await patternSearch.includeOutOfStock(true).execute();
	//
	// console.log(JSON.stringify(patternResponse.products));

	parser.on('data', ({ data: uglyData }: { data: UglyData }) => {
		const fabric = prisma.fabric.create({
			data: {
				externalId: uglyData.id,
				itemNumber: uglyData.ID + '',
				url: uglyData.master_product_url,
				name: uglyData.master_product_name,
				description: uglyData.description,
				basePrice: uglyData["Base Price"],
				rating: uglyData.bvAverageRating ?? uglyData.master_rating ?? -1,
				ratingCount: uglyData.bvReviewCount ?? -1,
				ratingMax: 5,
				tags: uglyData.group_ids,
				features: uglyData.productFeatures,
				seller: {
					connectOrCreate: {
						where: {
							name: 'Joann'
						},
						create: {
							name: 'Joann'
						}
					}
				},
				category: {
					connectOrCreate: {
						where: {
							externalId: uglyData.categoryNumber + ''
						},
						create: {
							externalId: uglyData.categoryNumber + '',
							description: uglyData.categoryDescription,
						}
					}
				},
				brand: {
					connectOrCreate: {
						where: {
							name: uglyData.brand || 'Unknown',
						},
						create: {
							name: uglyData.brand || 'Unknown',
						}
					}
				}
			},
		}).then(result => {
			console.log('Created fabric:', result);
		})

		// console.log(JSON.stringify(uglyData, null, 2));
	});

	const readStream = createReadStream('fabrics.jsonl');
	readStream.pipe(parser);
})();
