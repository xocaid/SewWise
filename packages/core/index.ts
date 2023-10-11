import { ApiClient } from './src/ApiClient';
import { SimplicityPatterns } from './src/queries';

const client = new ApiClient();
client.init().then(async (c) => {
	const response = await c.executeGraphQL(SimplicityPatterns);

	console.log(JSON.stringify(response));
});
