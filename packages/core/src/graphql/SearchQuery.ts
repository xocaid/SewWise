import { PatternBrand } from '../constants';
import { IQueryBuilder } from '../contracts';
import { PageInfo } from '../entity/PageInfo';
import { Product } from '../entity/Product';
import { ApiClient } from './ApiClient';
import { ProductConnection } from './ProductConnection';
import { SearchQueryResults } from './SearchQueryResults';

interface SearchFilter {
	searchTerm?: string;
	price?: {
		minPrice?: number;
		maxPrice?: number;
	};
	rating?: {
		minRating?: number;
		maxRating?: number;
	};
	categoryEntityId?: number;
	categoryEntityIds?: number[];
	searchSubCategories?: boolean;
	brandEntityIds?: number[];
	isFreeShipping?: boolean;
	isFeatured?: boolean;
	hideOutOfStock?: boolean;
}

export class SearchQuery implements IQueryBuilder<Product> {
	private readonly searchFilter: SearchFilter = {};
	private readonly productConnectionDefinition: ProductConnection;
	private readonly pageInfo: PageInfo;

	constructor() {
		this.pageInfo = new PageInfo(false, false, '', '');
		this.productConnectionDefinition = new ProductConnection(this.pageInfo);
	}

	get productConnection(): ProductConnection {
		return this.productConnectionDefinition;
	}

	async execute(): Promise<SearchQueryResults> {
		const client = ApiClient.getInstance();
		const rawResponse = await client.executeGraphQL(this.toQuery());

		return new SearchQueryResults(this, rawResponse);
	}

	filterByBrands(...brands: PatternBrand[]): this {
		this.searchFilter.brandEntityIds = brands;

		return this;
	}

	filterByCategory(...categories: number[]): this {
		if (categories.length === 1) {
			this.searchFilter.categoryEntityId = categories[0];
		} else {
			this.searchFilter.categoryEntityIds = categories;
		}

		return this;
	}

	filterByPrice(min?: number, max?: number): this {
		this.searchFilter.price = {
			minPrice: min,
			maxPrice: max,
		};

		return this;
	}

	filterByRating(min?: number, max?: number): this {
		this.searchFilter.rating = {
			minRating: min,
			maxRating: max,
		};

		return this;
	}

	includeOutOfStock(include: boolean = true): this {
		this.searchFilter.hideOutOfStock = include;

		return this;
	}

	includeSubCategories(include: boolean = true): this {
		this.searchFilter.searchSubCategories = true;

		return this;
	}

	isFeatured(featured: boolean = false): this {
		this.searchFilter.isFeatured = featured;

		return this;
	}

	isFreeShipping(freeShipping: boolean = true): this {
		this.searchFilter.isFreeShipping = freeShipping;

		return this;
	}

	searchTerm(keyword: string): this {
		this.searchFilter.searchTerm = keyword;

		return this;
	}

	private toQuery(): string {
		const filters = Object.entries(this.searchFilter).map(
			([filter, value]) => `${filter}: ${JSON.stringify(value)}`,
		);

		return `
			query SearchProducts {
				site {
					search {
						searchProducts(
							filters: { ${filters.join(',')} }
							sort: FEATURED
						) {
							${this.productConnection.graphqlSource}
						}
					}
				}
			}
		`;
	}
}
