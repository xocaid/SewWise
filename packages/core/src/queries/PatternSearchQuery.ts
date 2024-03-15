import { gql } from '@apollo/client/core';

import { PatternBrand } from '../constants';
import { IQueryBuilder } from '../contracts';
import {
	ProductConnection,
	SearchProductsFiltersInput,
	SearchProductsSortInput,
	SearchQueriesSearchProductsArgs,
} from '../generated/graphql';
import { PatternSearchResult } from './PatternSearchResult';
import { SimplicityApiClient } from './SimplicityApiClient';

const GraphQL = gql`
	query SearchProducts(
		$filters: SearchProductsFiltersInput!
		$sort: SearchProductsSortInput!
	) {
		site {
			search {
				searchProducts(filters: $filters, sort: $sort) {
					products(first: 50) {
						pageInfo {
							hasNextPage
							hasPreviousPage
							startCursor
							endCursor
						}
						collectionInfo {
							totalItems
						}
						edges {
							node {
								entityId
								name
								createdAt {
									utc
								}
								path
								sku
								categories {
									edges {
										node {
											id
											entityId
											name
										}
									}
								}
								brand {
									id
									entityId
									name
								}
								images {
									edges {
										node {
											url(height: 381, width: 276)
										}
									}
								}
								prices {
									price {
										value
									}
									basePrice {
										value
									}
									retailPrice {
										value
									}
									salePrice {
										value
									}
								}
							}
						}
					}
				}
			}
		}
	}
`;

export interface PatternSearchResultType {
	site: {
		search: {
			searchProducts: {
				products: ProductConnection;
			};
		};
	};
}

export class PatternSearchQuery implements IQueryBuilder<PatternSearchResult> {
	private readonly searchFilter: SearchProductsFiltersInput = {};

	async execute() {
		const client = SimplicityApiClient.getInstance();
		await client.init();

		const response = await client.executeGraphQL<
			PatternSearchResultType,
			SearchQueriesSearchProductsArgs
		>(GraphQL, {
			filters: this.searchFilter,
			sort: SearchProductsSortInput.Featured,
		});

		return new PatternSearchResult(this, response.data);
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
}
