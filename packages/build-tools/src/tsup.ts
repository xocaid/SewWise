import { Options } from 'tsup';
import type { PackageJson } from 'type-fest';

export const DEFAULT_ENTRY = 'src/index.ts';

export const defaultTsupConfig = (
	pkg: PackageJson,
	entryPoint: string | string[] = [DEFAULT_ENTRY],
	overrides?: Partial<Options>,
): Options => ({
	treeshake: true,
	splitting: true,
	entry: Array.isArray(entryPoint) ? entryPoint : [entryPoint],
	target: 'esnext',
	format: ['esm'],
	dts: true,
	minify: false,
	clean: true,
	sourcemap: true,
	external: [
		// Don't bundle dependencies
		...Object.keys(pkg?.dependencies ?? {}),

		// Don't bundle built-in Node.js modules (use protocol imports!)
		/^node:.*/,
	],

	// When this environment variable is set, that means the `local-pack` script
	// is running, and we don't want build output to interfere with JSON output
	// from npm commands.
	silent: process.env.DEBUG_PACKING === '1',

	// If the developer knows what they're doing, they can override any default
	// options.
	...overrides,
});
