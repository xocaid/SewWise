import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
	overwrite: true,
	schema: './src/adapters/Simplicity/resources/schema.graphql',
	generates: {
		'src/adapters/Simplicity/graphql.ts': {
			plugins: ['typescript'],
		},
	},
};

export default config;
