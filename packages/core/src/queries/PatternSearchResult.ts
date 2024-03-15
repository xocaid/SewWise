import { Product } from '../generated/graphql';
import {
	PatternSearchQuery,
	PatternSearchResultType,
} from './PatternSearchQuery';

export class PatternSearchResult {
	private readonly _totalItems: number;
	private _products: Product[] = [];

	constructor(
		public readonly query: PatternSearchQuery,
		response: PatternSearchResultType,
	) {
		const connection = response.site.search.searchProducts.products;

		this._totalItems = connection.collectionInfo?.totalItems ?? -1;

		for (const product of connection?.edges ?? []) {
			if (product) {
				this._products.push(product.node);
			}
		}
	}

	get products(): Product[] {
		return this._products;
	}

	get totalItems(): number {
		return this._totalItems;
	}
}
