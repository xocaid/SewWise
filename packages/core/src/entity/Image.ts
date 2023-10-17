export class Image {
	readonly url: string;

	constructor(graphql: any) {
		this.url = graphql.node.url;
	}
}
