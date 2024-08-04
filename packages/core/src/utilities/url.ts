export function objToQueryParams(
	payload: object,
	keysToIgnore: string[] = [],
	path: string | null = null,
	agg: Record<string, string> = {},
): Record<string, string> {
	return Object.entries(payload).reduce((agg, [key, value]) => {
		const pathWithKey = path ? `${path}[${key}]` : key;

		if (typeof value === 'object' && value) {
			return objToQueryParams(value, keysToIgnore, pathWithKey, agg);
		}

		if (keysToIgnore.includes(key)) {
			return agg;
		}

		return {
			...agg,
			[pathWithKey]: '' + value,
		};
	}, agg);
}
