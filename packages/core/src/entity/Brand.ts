export class Brand {
	readonly entityId: number;
	readonly name: string;

	constructor(graphRes: any) {
		this.entityId = graphRes.entityId;
		this.name = graphRes.name;
	}
}
