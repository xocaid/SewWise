import { runCommand } from '@oclif/test';
import { expect } from 'chai';

describe('fabrics', () => {
	it('runs fabrics cmd', async () => {
		const { stdout } = await runCommand('fabrics');
		expect(stdout).to.contain('hello world');
	});

	it('runs fabrics --name oclif', async () => {
		const { stdout } = await runCommand('fabrics --name oclif');
		expect(stdout).to.contain('hello oclif');
	});
});
