export class Category {
	readonly entityId: number;
	readonly name: number;

	constructor(graphRes: any) {
		this.entityId = graphRes.node.entityId;
		this.name = graphRes.node.name;
	}
}
