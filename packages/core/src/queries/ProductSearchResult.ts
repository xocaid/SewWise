import { Product } from '../generated/graphql';
import {
	ProductSearchQuery,
	ProductSearchResultType,
} from './ProductSearchQuery';

export class ProductSearchResult {
	private readonly _totalItems: number;
	private _products: Product[] = [];

	constructor(
		public readonly query: ProductSearchQuery,
		response: ProductSearchResultType,
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
