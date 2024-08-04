import { runCommand } from '@oclif/test';
import { expect } from 'chai';

describe('fabrics:download', () => {
	it('runs fabrics:download cmd', async () => {
		const { stdout } = await runCommand('fabrics:download');
		expect(stdout).to.contain('hello world');
	});

	it('runs fabrics:download --name oclif', async () => {
		const { stdout } = await runCommand('fabrics:download --name oclif');
		expect(stdout).to.contain('hello oclif');
	});
});
