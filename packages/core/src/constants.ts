import gql from 'graphql-tag';

/**
 * @see https://medium.com/@mrthankyou/how-to-get-a-graphql-schema-28915025de0e
 */
export const GraphqlSchemaIntrospection = gql`
	fragment FullType on __Type {
		kind
		name
		fields(includeDeprecated: true) {
			name
			args {
				...InputValue
			}
			type {
				...TypeRef
			}
			isDeprecated
			deprecationReason
		}
		inputFields {
			...InputValue
		}
		interfaces {
			...TypeRef
		}
		enumValues(includeDeprecated: true) {
			name
			isDeprecated
			deprecationReason
		}
		possibleTypes {
			...TypeRef
		}
	}
	fragment InputValue on __InputValue {
		name
		type {
			...TypeRef
		}
		defaultValue
	}
	fragment TypeRef on __Type {
		kind
		name
		ofType {
			kind
			name
			ofType {
				kind
				name
				ofType {
					kind
					name
					ofType {
						kind
						name
						ofType {
							kind
							name
							ofType {
								kind
								name
								ofType {
									kind
									name
								}
							}
						}
					}
				}
			}
		}
	}
	query IntrospectionQuery {
		__schema {
			queryType {
				name
			}
			mutationType {
				name
			}
			types {
				...FullType
			}
			directives {
				name
				locations
				args {
					...InputValue
				}
			}
		}
	}
`;

export enum PatternBrand {
	Simplicity = 38,
	McCalls = 52,
	Butterick = 51,
	Vogue = 53,
	KnowMe = 54,
	NewLook = 39,
	BurdaStyle = 40,
}
