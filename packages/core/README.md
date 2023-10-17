# SewWise Core

A library designed to interact with Simplicity's private GraphQL API. This project has support for functionality needed for the SewWise project and does not fully support the GraphQL API; contributions for more functionality is welcome via PRs!

> [!IMPORTANT]
> This project is **NOT** supported by Simplicity or its related brands. There may be periods of occasional breakage should Simplicity change their GraphQL API in a breaking way.

## Installation

```bash
npm install @xocaid/sewwise-core
```

## Example Usage

```typescript
const client = ApiClient.getInstance();
await client.init();

const searchQuery = new SearchQuery()
	.filterByBrands(PatternBrand.Simplicity)
	.includeOutOfStock(true);

const response = await searchQuery.execute();

for (const product of response.getResults()) {
	console.log(product.name, '-', product.brand.name, '-', product.images);
}
```

## Documentation

TODO.
