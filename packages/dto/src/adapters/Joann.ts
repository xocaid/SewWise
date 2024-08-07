import { Joann } from '@xocaid/sewwise-core';

import { Prisma } from '../generated';

export function fromResponseToDTOs(
	res: Joann.JoannResponse,
): Prisma.FabricCreateInput[] {
	return res.response.results.map(
		(result) =>
			({
				external_id: result.data.ID + '',
				name: result.data.name,
				url: result.data.url,
				seller: 'Joaan',
				status: 'IN_STOCK',
				variants: {
					create: result.variations.map(
						(variation, idx) =>
							({
								external_id: variation.data.variation_id,
								name: result.value,
								url: result.data.url,
								images: {
									create: [
										{
											original_url: result.data.image_url,
										},
									],
								},
							}) as Prisma.FabricVariantCreateInput,
					),
				},
			}) as Prisma.FabricCreateInput,
	);
}
