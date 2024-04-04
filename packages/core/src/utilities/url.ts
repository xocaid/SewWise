export function objToQueryParams(
	payload: object,
	path: string | null = null,
	agg: Record<string, string> = {},
): Record<string, string> {
	return Object.entries(payload).reduce((agg, [key, value]) => {
		const pathWithKey = path ? `${path}[${key}]` : key;

		if (typeof value === 'object' && value) {
			return objToQueryParams(value, pathWithKey, agg);
		}

		return {
			...agg,
			[pathWithKey]: '' + value,
		};
	}, agg);
}
