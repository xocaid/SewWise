import { Args, Command, Flags } from '@oclif/core';
import { FabricSearchQuery, Joann } from '@xocaid/sewwise-core';

export default class FabricsSearch extends Command {
	static override args = {
		term: Args.string({ description: 'search term', required: true }),
	};

	static override description = 'search for fabrics';

	static override examples = ['<%= config.bin %> <%= command.id %>'];

	static override flags = {
		filter: Flags.string({
			char: 'f',
			description: 'filter to apply',
			multiple: true,
		}),
		sort: Flags.string({
			char: 's',
			description: 'sort order',
			multiple: true,
		}),
	};

	public async run(): Promise<void> {
		const { args, flags } = await this.parse(FabricsSearch);

		const apiClient = new FabricSearchQuery();

		apiClient.searchTerm(args.term);

		this.applySearchFilters(apiClient, flags.filter);
		this.applySortOrder(apiClient, flags.sort);

		const response = await apiClient.execute();

		this.log(JSON.stringify(response));
	}

	private applySearchFilters(apiClient: FabricSearchQuery, filters?: string[]) {
		if (filters?.length === 0) {
			return;
		}

		const validFilters = Object.keys(Joann.SearchFilter);

		filters?.forEach((filter) => {
			const [key, value] = filter.split('=');

			if (!validFilters.includes(key)) {
				this.warn(`Invalid filter: ${key}`);

				return;
			}

			apiClient.applyFilter(key as any, value);
		});
	}

	private applySortOrder(apiClient: FabricSearchQuery, sort?: string[]) {
		if (sort?.length === 0) {
			return;
		}

		const validSortOptions = ['asc', 'desc'];

		sort?.forEach((sortOption) => {
			const [key, value] = sortOption.split(',');

			if (!validSortOptions.includes(value.toLowerCase())) {
				this.warn(`Invalid sort order: ${value}`);

				return;
			}

			apiClient.sortBy(key, value === 'asc');
		});
	}
}
