export interface FabricData {
	__source: object;
	rating: number;
	ratingCount: number;
	ratingMax: number;
	category: {
		externalId: string;
		name: string;
	};
	materials: string[];
	dimensionLimits: string;
	fabricCare: string;
	_fabricMaterial: string;
	keywords: string;
	merchCategory: {
		externalId: string;
		name: string;
	};
	relativeUrl: string;
	openGraphImage: string;
	description: string;
	mainImageUrl: string;
	name: string;
	itemNumber: string;
	url: string;
	basePrice?: number;
	discountPrice?: number;
	fabricWidth: number;
	externalId: string;
	images: {
		url: string;
		alt: string;
	}[];
	manufacturerSku: string;
}

export interface ProjectData {
	__source: object;
	craftingTime: string;
	description: string;
	disclaimer: string;
	images: unknown;
	itemNumber: string;
	keywords: string[];
	name: string;
	pdfPath: string;
	skillLevel: string;
}
