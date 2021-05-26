import { Client, expect } from '@loopback/testlab';

import { LoopbackAuthPassportApplication } from '../..';

import { setupApplication } from './test-helper';

const HTTP_STATUS_CODE_OK = 200;

describe('PingController', () => {
	let app: LoopbackAuthPassportApplication;
	let client: Client;

	before('setupApplication', async () => {
		({ app, client } = await setupApplication());
	});

	after(async () => {
		await app.stop();
	});

	it('invokes GET /ping', async () => {
		const res = await client
			.get('/ping?msg=world')
			.expect(HTTP_STATUS_CODE_OK);
		expect(res.body).to.containEql({ greeting: 'Hello from LoopBack' });
	});
});
