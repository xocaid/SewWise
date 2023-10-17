import { IGraphqlNode, PropertiesOf } from '../contracts';
import { PageInfo } from '../entity/PageInfo';

export class ProductConnection implements IGraphqlNode {
	readonly pageInfo: PageInfo;

	constructor(pageInfo: PropertiesOf<PageInfo>) {
		this.pageInfo = new PageInfo(
			pageInfo.hasNextPage,
			pageInfo.hasPreviousPage,
			pageInfo.startCursor,
			pageInfo.endCursor,
		);
	}

	get graphqlSource(): string {
		return `
			products(first: 50) {
				${this.pageInfo.graphqlSource}
				collectionInfo {
					totalItems
				}
				edges {
					cursor
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
							name
							entityId
							id
						}
						images {
							edges {
								node {
									url(width: 276, height: 381)
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
		`;
	}
}
