import { defineConfig, Options } from 'tsup';

import { defaultTsupConfig } from './src/';

import pkg from './package.json' assert { type: 'json' };

export default defineConfig((options: Options) => ({
	...defaultTsupConfig(pkg),
	...options,
}));
