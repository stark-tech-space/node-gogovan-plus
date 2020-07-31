import Gogovanplus from '../src';
import dotenv from 'dotenv';
import { addMinutes } from 'date-fns/fp';

dotenv.config();

const gogovan = new Gogovanplus(
	process.env.API_EMAIL || '',
	process.env.API_PASSWORD || '',
	process.env.API_ENDPOINT || ''
);

const sampleGetPrice = {
	booth: false,
	carry: false,
	locations: [
		['', '', '台灣台北市中山區松江路9號', '2樓'],
		['25.0463042', '121.5331887', '台灣台北市中山區松江路9號', ''],
	],
	pickup_time: addMinutes(2000)(new Date()),
	vehicle: 'motorcycle' as 'motorcycle',
};

const sampleCreateOrder = {
	booth: false,
	carry: false,
	cod_price: '',
	invoice: {
		address: '',
		email: '',
		name: '',
		note: '',
		tax_id_no: '',
	},
	is_bonus_first: false,
	locations: [
		['', '', '台灣台北市中山區松江路9號', '2樓'],
		['25.0463042', '121.5331887', '台灣台北市中山區松江路9號', ''],
	],
	name: 'Test Sender',
	need_insulation_bags: false,
	note: 'Bring everything to the door',
	phone_number: '123',
	pickup_time: addMinutes(60)(new Date()),
	receiver_name: 'Test Receiver',
	receiver_phone_number: '123',
	vehicle: 'motorcycle' as 'motorcycle',
};

const prevOrderId = '13791';

describe('order api', () => {
	it('should get price', async () => {
		try {
			const res = await gogovan.getPrice(sampleGetPrice);
			console.log('get price', JSON.stringify(res, null, 2));
			expect(res.success).toBe(true);
			expect(res.msg).toBeDefined();
			expect(res.data).toBeDefined();
		} catch (error) {
			console.log(error);
			throw error;
		}
	});

	let orderId = '';

	it.skip('should create order', async () => {
		try {
			const res = await gogovan.createOrder(sampleCreateOrder);
			console.log('create order', JSON.stringify(res, null, 2));
			if (res.success) {
				orderId = res.order_id;
			}
			expect(res.success).toBe(true);
			expect(res.order_id).toBeDefined();
			expect(res.price).toBeDefined();
		} catch (error) {
			console.log(error);
			throw error;
		}
	});

	it.skip('should cancel order', async () => {
		const sampleCancel = {
			action: 'cancel' as 'cancel',
			order_id: orderId,
		};
		try {
			const res = await gogovan.cancelOrder(sampleCancel);
			console.log('cancel order', JSON.stringify(res, null, 2));
			expect(res.success).toBe(true);
		} catch (error) {
			console.log(error);
			throw error;
		}
	});

	it('should get order status', async () => {
		try {
			const res = await gogovan.getOrderStatus(prevOrderId);
			console.log('get order status', JSON.stringify(res, null, 2));
			expect(res.id).toBe(parseInt(prevOrderId, 10));
			expect(res.status).toBeDefined();
			expect(res.name).toBeDefined();
			expect(res.phone_number).toBeDefined();
		} catch (error) {
			console.log(error);
			throw error;
		}
	});
});

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
