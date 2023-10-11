export const SimplicityPatterns = `
	query SearchProducts {
		site {
			search {
				searchProducts(
					filters: { searchSubCategories: true, brandEntityIds: [38] }
					sort: FEATURED
				) {
					products(first: 50) {
						pageInfo {
							hasNextPage
							hasPreviousPage
							startCursor
							endCursor
						}
						collectionInfo {
							totalItems
						}
						edges {
							cursor
							node {
								entityId
								name
								createdAt {
									utc
								}
								path
								sku
								categories {
									edges {
										node {
											id
											entityId
											name
										}
									}
								}
								brand {
									name
									entityId
									id
								}
								images {
									edges {
										node {
											url(width: 276, height: 381)
										}
									}
								}
								prices {
									price {
										value
									}
									basePrice {
										value
									}
									retailPrice {
										value
									}
									salePrice {
										value
									}
								}
								customFields {
									edges {
										node {
											name
											value
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
`;
