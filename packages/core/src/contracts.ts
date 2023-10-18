export interface IQueryBuilder<E extends object> {
	execute(): Promise<E>;
}
