import Gogovanplus from '../lib';
import dotenv from 'dotenv';

dotenv.config();

const gogovan = new Gogovanplus(
	process.env.API_EMAIL || '',
	process.env.API_PASSWORD || '',
	process.env.API_ENDPOINT || ''
);

describe('wallet api', () => {
	it('should get wallet balance', async () => {
		try {
			const res = await gogovan.getWalletBalance();
			console.log('get wallet balance', JSON.stringify(res, null, 2));
			expect(res.success).toBe(true);
			expect(res.amount).toBeDefined();
		} catch (error) {
			console.log(error);
			throw error;
		}
	});
});
