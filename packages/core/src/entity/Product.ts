import { Brand } from './Brand';
import { Category } from './Category';
import { Image } from './Image';

export class Product {
	readonly entityId: number;
	readonly name: string;
	readonly createdAt: Date;
	readonly urlPath: string;
	readonly sku: string;
	readonly categories: Category[];
	readonly brand: Brand;
	readonly images: Image[];
	readonly price: number;
	readonly basePrice: number;
	readonly retailPrice: number;
	readonly salePrice: number;

	constructor(product: any) {
		this.entityId = product.node.entityId;
		this.name = product.node.name;
		this.createdAt = new Date(product.node.createdAt.utc);
		this.urlPath = product.node.path;
		this.sku = product.node.sku;
		this.categories = product.node.categories.edges.map(
			(categoryRaw: object) => new Category(categoryRaw),
		);
		this.brand = new Brand(product.node.brand);
		this.images = product.node.images.edges.map(
			(imageRaw: object) => new Image(imageRaw),
		);
		this.price = product.node.prices.price.value;
		this.basePrice = product.node.prices.basePrice.value;
		this.retailPrice = product.node.prices.retailPrice?.value;
		this.salePrice = product.node.prices.salePrice?.value;
	}
}
