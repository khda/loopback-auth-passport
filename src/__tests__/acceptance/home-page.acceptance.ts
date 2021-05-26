import { Client } from '@loopback/testlab';

import { LoopbackAuthPassportApplication } from '../..';

import { setupApplication } from './test-helper';

const HTTP_STATUS_CODE_OK = 200;

describe('HomePage', () => {
	let app: LoopbackAuthPassportApplication;
	let client: Client;

	before('setupApplication', async () => {
		({ app, client } = await setupApplication());
	});

	after(async () => {
		await app.stop();
	});

	it('exposes a default home page', async () => {
		await client
			.get('/')
			.expect(HTTP_STATUS_CODE_OK)
			.expect('Content-Type', /text\/html/u);
	});

	it('exposes self-hosted explorer', async () => {
		await client
			.get('/explorer/')
			.expect(HTTP_STATUS_CODE_OK)
			.expect('Content-Type', /text\/html/u)
			.expect(/<title>LoopBack API Explorer/u);
	});
});
