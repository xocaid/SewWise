import { IGraphqlNode } from '../contracts';

export class PageInfo implements IGraphqlNode {
	readonly graphqlSource = `
		pageInfo {
			hasNextPage
			hasPreviousPage
			startCursor
			endCursor
		}
	`;

	constructor(
		public readonly hasNextPage: boolean,
		public readonly hasPreviousPage: boolean,
		public readonly startCursor: string,
		public readonly endCursor: string,
	) {}
}
