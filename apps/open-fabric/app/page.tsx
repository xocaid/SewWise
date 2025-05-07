import { prisma } from '@/lib/prisma';

export default async function Home() {
	const fabrics = await prisma.fabric.findMany({ take: 10 });

	return (
		<div>
			{fabrics.map((fabric) => (
				<div key={fabric.id} className="p-4 border-b">
					<h2 className="text-xl font-bold">{fabric.name}</h2>
					<p>{fabric.description}</p>
					<p>Price: ${fabric.basePrice.toString()}</p>
				</div>
			))}
		</div>
	);
}
