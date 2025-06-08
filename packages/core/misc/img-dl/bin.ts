import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

import { getFabricDetails, getProjectDetails } from '../../src/scrappers';

enum ImportType {
	Fabrics,
	Projects,
}

const Hostname = 'http://mac-mini-server-2018.local:8080/www.joann.com/';
const ScrapperMappings = {
	[ImportType.Fabrics]: {
		extractor: getFabricDetails,
		filename: 'all-fabric-urls.txt',
		urlPrefix: 'p/',
	},
	[ImportType.Projects]: {
		extractor: getProjectDetails,
		filename: 'all-project-urls.txt',
		urlPrefix: '',
	},
};

type ReturnTypes<T> = T extends (...args: any[]) => infer R ? R : never;
type ExtractorCallbacks = typeof ScrapperMappings[ImportType]['extractor'];
type ExtractorTypes = Awaited<ReturnTypes<ExtractorCallbacks>>;

function eachUrl<T extends ImportType>(
	type: T,
	callback: (element: ExtractorTypes) => void,
): Promise<void> {``
	const fileStream = createReadStream(ScrapperMappings[type].filename);
	const rl = createInterface({
		input: fileStream,
		crlfDelay: Infinity,
	});

	return new Promise((resolve, reject) => {
		rl.on('line', async (line) => {
			try {
				const url = `${Hostname}${ScrapperMappings[type].urlPrefix}${line}`;
				const data = await ScrapperMappings[type].extractor(url);

				callback(data);
			} catch (error) {
				reject(error);
			}
		});

		rl.on('close', resolve);
	});
}

(async () => {
	await eachUrl(ImportType.Projects, async (project) => {
		if (!project) {
			return;
		}

		console.log({ project });
	});
})().catch(console.error);
