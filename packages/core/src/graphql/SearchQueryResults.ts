import { IQueryBuilder, IQueryResults } from '../contracts';
import { PageInfo } from '../entity/PageInfo';
import { Product } from '../entity/Product';

export class SearchQueryResults implements IQueryResults<Product> {
	private readonly paginationSrc: PageInfo;
	private readonly lengthSrc: number;
	private readonly resultsSrc: Array<unknown>;
	private readonly resultsSrcExhausted: boolean;
	private readonly resultsCache: Product[];

	constructor(
		private readonly queryBuilder: IQueryBuilder<Product>,
		graphRes: any,
	) {
		const response = graphRes.data.site.search.searchProducts.products;

		if (response == null) {
			throw new Error('GraphQL response not in expected structure');
		}

		this.paginationSrc = response.pageInfo;
		this.lengthSrc = response.collectionInfo.totalItems;
		this.resultsSrc = Object.values(response.edges);
		this.resultsSrcExhausted = false;
		this.resultsCache = [];
	}

	get length(): number {
		return this.lengthSrc;
	}

	get pagination(): PageInfo {
		return this.paginationSrc;
	}

	*getResults(): Iterable<Product> {
		if (this.resultsSrcExhausted) {
			yield* this.resultsCache;

			return;
		}

		for (const resultSrc of this.resultsSrc) {
			const product = new Product(resultSrc);

			this.resultsCache.push(product);

			yield product;
		}
	}
}
