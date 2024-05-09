export interface Pattern {
	url: string;
	name: string;
	available: boolean;
	isClearance: boolean;
	isNew: boolean;
	isSale: boolean;
	isVideo: boolean;
	description: string;
	shipsToStore: boolean;
	rating: number;
	reviewCount: number;
	isInternational: boolean;
	isWeaveUpProduct: boolean;
	isJoannExclusive: boolean;
	isOnlineOnly: boolean;
	unitOfMeasurement: string;
	freeShipping: boolean;
	inStorePickup: boolean;
	basePrice: number;
	currentPrice: number;
	howToGetIt: string[];
}
