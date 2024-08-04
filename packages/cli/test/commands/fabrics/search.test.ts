import { runCommand } from '@oclif/test';
import { expect } from 'chai';

describe('fabrics:search', () => {
	it('runs fabrics:search cmd', async () => {
		const { stdout } = await runCommand('fabrics:search');
		expect(stdout).to.contain('hello world');
	});

	it('runs fabrics:search --name oclif', async () => {
		const { stdout } = await runCommand('fabrics:search --name oclif');
		expect(stdout).to.contain('hello oclif');
	});
});
