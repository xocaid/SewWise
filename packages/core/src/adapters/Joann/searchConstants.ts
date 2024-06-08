export interface SearchOptions {
	filters: Partial<Record<SearchFilter, number | string>>;
	num_results_per_page?: number; // default: 30
	page?: number;
	sort_by?: SortBy;
	sort_order?: 'ascending' | 'descending';
}

export enum SearchFilter {
	Type = 'ecommerceType2',
	Collection = 'collection',
	Color = 'refinementColors',
	Content = 'content',
	Brand = 'brand',
	Size = 'size',
	Holiday = 'holiday',
	Seasons = 'seasons',
	Character = 'character',
	Team = 'team',
	HowToGetIt = 'howToGetIt',
	ProductFeatures = 'productFeatures',
	Price = 'Current Price',
	CustomerRatings = 'bvAverageRating',
	NewArrival = 'isNew',
	OnSale = 'isSale',
	Clearance = 'isClearance',
	BuyInBulk = 'isBuyInBulk',
	FabricProjectType = 'fabricProjectType',
	ProductCategory = 'productCategory',
	Pattern = 'pattern',
	OnlyAtJoann = 'isJoannExclusive',
	Theme = 'ecommerceTheme2',
	ProductType = 'productGroup',
	Weight = 'Weight',
	RubCount = 'rubCount',
	FabricUpholsteryGrade = 'fabricupholsterygrade',
	Material = 'material',
	SoldBy = 'soldBy',
	ClearanceOffer = 'clearanceOffer',
}

export enum SortBy {
	BestSellers = 'revenueWeek',
	TrendingNow = 'viewsDay',
	TopRated = 'bvAverageRating',
	MostRelevant = 'relevance',
	Price = 'Current Price',
	NewArrivals = 'daysOnline',
}

export const VARIATIONS_MAP_KEY = 'variations_map';

/**
 * This is a magic that the Joann's API uses and it seems to be static
 * in every call.
 */
export const VARIATIONS_MAP = {
	values: {
		facets: {
			aggregation: 'first',
			field: 'data.facets',
		},
		url: {
			aggregation: 'all',
			field: 'data.url',
		},
		availableForInStorePickup: {
			aggregation: 'first',
			field: 'data.availableForInStorePickup',
		},
		image_url: {
			aggregation: 'all',
			field: 'data.image_url',
		},
		swatch_image_url: {
			aggregation: 'all',
			field: 'data.swatch_image_url',
		},
		refinementColors: {
			aggregation: 'all',
			field: 'data.refinementColors',
		},
		name: {
			aggregation: 'first',
			field: 'data.name',
		},
		variation_id: {
			aggregation: 'all',
			field: 'data.variation_id',
		},
	},
	dtype: 'object',
} as const;
