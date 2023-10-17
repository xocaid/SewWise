import { PageInfo } from './entity/PageInfo';

export interface IGraphqlNode {
	graphqlSource: string;
}

export interface IQueryResults<E extends object> {
	length: number;
	pagination: PageInfo;
	getResults(): Iterable<E>;
}

export interface IQueryBuilder<E extends object> {
	execute(): Promise<IQueryResults<E>>;
}

export type PropertiesOf<T extends object> = {
	[key in keyof T]: T[key];
};
