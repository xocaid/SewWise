export interface JoannResponse {
	response: Response;
	result_id: string;
	request: Request;
}

export interface Request {
	page: number;
	num_results_per_page: number;
	sort_by: string;
	sort_order: string;
	filters: Filters;
	blacklist_rules: boolean;
	term: string;
	fmt_options: FmtOptions;
	section: string;
	features: { [key: string]: boolean };
	feature_variants: FeatureVariants;
	filter_match_types: FilterMatchTypes;
	searchandized_items: SearchandizedItems;
	browse_filter_name: string;
	browse_filter_value: BrowseFilterValue;
}

export enum BrowseFilterValue {
	All = 'All',
	Fabric = 'fabric',
	Shopping = 'shopping',
}

export interface FeatureVariants {
	query_items: string;
	a_a_test: null;
	auto_generated_refined_query_rules: string;
	manual_searchandizing: null;
	personalization: string;
	filter_items: string;
	use_reranker_service_for_search: null;
	use_reranker_service_for_browse: null;
	use_reranker_service_for_all: null;
	custom_autosuggest_ui: null;
	disable_test_only_global_rules_search: null;
	disable_test_only_global_rules_browse: null;
	use_enriched_attributes_as_fuzzy_searchable: null;
}

export interface FilterMatchTypes {
	howToGetIt: string;
}

export interface Filters {
	howToGetIt: string[];
}

export interface FmtOptions {
	groups_start: string;
	groups_max_depth: number;
	show_hidden_facets: boolean;
	show_hidden_fields: boolean;
	show_protected_facets: boolean;
}

export interface SearchandizedItems {}

export interface Response {
	result_sources: ResultSources;
	facets: ResponseFacet[];
	groups: Group[];
	results: Result[];
	sort_options: SortOption[];
	refined_content: any[];
	total_num_results: number;
	features: Feature[];
}

export interface ResponseFacet {
	display_name: string;
	name: string;
	type: Type;
	options: Option[];
	hidden: boolean;
	data: SearchandizedItems;
}

export interface Option {
	status: Status;
	count: number;
	display_name: string;
	value: string;
	data: SearchandizedItems | null;
	range?: Array<number | string>;
}

export enum Status {
	Empty = '',
	Selected = 'selected',
}

export enum Type {
	Multiple = 'multiple',
	Single = 'single',
}

export interface Feature {
	feature_name: string;
	display_name: string;
	enabled: boolean;
	variant: Variant | null;
}

export interface Variant {
	name: string;
	display_name: string;
}

export interface Group {
	group_id: string;
	display_name: string;
	count: number;
	data: GroupData;
	children: Group[];
	parents: Parent[];
}

export interface GroupData {
	page_url: string;
}

export interface Parent {
	display_name: DisplayName;
	group_id: BrowseFilterValue;
}

export enum DisplayName {
	All = 'All',
	Fabric = 'Fabric',
	Shopping = 'Shopping',
}

export interface ResultSources {
	token_match: Match;
	embeddings_match: Match;
}

export interface Match {
	count: number;
}

export interface Result {
	matched_terms: any[];
	labels: SearchandizedItems;
	data: ResultData;
	value: Value;
	is_slotted: boolean;
	variations: Variation[];
}

export interface ResultData {
	id?: string;
	ID: number;
	url: string;
	name: Value;
	isNew: boolean;
	isSale: boolean;
	isVideo: boolean;
	group_ids?: string[];
	Available: boolean;
	isProject: boolean;
	image_url: string;
	onlineFlag: boolean;
	searchable?: boolean;
	masterType?: string;
	isFinalSale: boolean;
	isClearance: boolean;
	description?: string;
	salesChannel: SalesChannel;
	productGroup: ProductGroup;
	shipsToStore: boolean;
	articleStatus: number;
	bvReviewCount: number;
	master_rating?: number;
	isInternational: boolean;
	isReplenishable: boolean;
	bvAverageRating: number;
	isJoannExclusive: boolean;
	master_image_url?: string;
	minOrderQuantity: number;
	isWeaveUpProduct: boolean;
	isOnlineExclusive: boolean;
	master_product_url?: string;
	master_review_count?: number;
	facets: DataFacet[];
	master_product_name?: Value;
	primaryCategoryPath?: string;
	articleUnitOfMeasure: ArticleUnitOfMeasure;
	isFreeStandardShipping: boolean;
	availableForInStorePickup: boolean;
	'Alternate Images'?: AlternateImages;
	searchableIfUnavailableFlag: boolean;
	shippedToHomeMinOrderQuantity: number;
	'Base Price': number;
	howToGetIt: HowToGetIt;
	'Promotion ID': PromotionID;
	variation_id: string;
	'Current Price': number;
	variationType: VariationType;
	refinementColors: string;
	swatch_image_url: string;
	IsDisplayableOnSite: boolean;
}

export interface AlternateImages {
	altImages: string[];
}

export enum PromotionID {
	F399SymphonyBroadcloth = 'f_3.99SymphonyBroadcloth',
}

export enum ArticleUnitOfMeasure {
	Yd = 'YD',
}

export interface DataFacet {
	name: Name;
	values: ProductGroup[];
}

export enum Name {
	IsDisplayableOnSite = 'IsDisplayableOnSite',
	IsInternational = 'isInternational',
	ProductGroup = 'productGroup',
}

export enum ProductGroup {
	False = 'False',
	Product = 'Product',
	True = 'True',
}

export enum HowToGetIt {
	FREECurbsidePickUp = 'FREE curbside & pick-up',
	ShipToMeFREECurbsidePickUp = 'Ship to me|FREE curbside & pick-up',
}

export enum Value {
	SymphonyBroadclothPolyesterBlendFabricSolids = 'Symphony Broadcloth Polyester Blend Fabric  Solids',
}

export enum SalesChannel {
	B = 'B',
}

export enum VariationType {
	Variant = 'variant',
}

export interface Variation {
	data: ResultData;
	value: Value;
}

export interface SortOption {
	sort_by: string;
	display_name: string;
	sort_order: string;
	status: Status;
}
