import Gogovanplus from '../src';
import dotenv from 'dotenv';
import { format, addMinutes } from 'date-fns/fp';

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
	pickup_time: format('yyyy/MM/dd HH:mm')(addMinutes(30)(new Date())),
	vehicle: 'motorcycle' as 'motorcycle',
};

test('get price', async () => {
	try {
		const res = await gogovan.getPrice(sampleGetPrice);
		console.log(res);
		expect(res.data.success).toBe(true);
	} catch (error) {
		console.log(error);
		throw error;
	}
});

const sampleCreateOrder = {
	booth: false,
	carry: false,
	cod_price: '',
	is_bonus_first: false,
	locations: [
		['', '', '台灣台北市中山區松江路9號', '2樓'],
		['25.0463042', '121.5331887', '台灣台北市中山區松江路9號', ''],
	],
	name: 'Test Sender',
	need_insulation_bags: false,
	note: 'Bring everything to the door',
	phone_number: '123',
	pickup_time: format('yyyy/MM/dd HH:mm')(addMinutes(30)(new Date())),
	receiver_name: 'Test Receiver',
	receiver_phone_number: '123',
	vehicle: 'motorcycle' as 'motorcycle',
};

test('create order', async () => {
	try {
		const res = await gogovan.createOrder(sampleCreateOrder);
		console.log(res);
		expect(res.data.success).toBe(true);
	} catch (error) {
		console.log(error);
		throw error;
	}
});

const sampleCancel = {
	action: 'cancel' as 'cancel',
	order_id: '0000',
};

test('cancel order', async () => {
	try {
		const res = await gogovan.cancelOrder(sampleCancel);
		console.log(res);
		expect(res.data.success).toBe(true);
	} catch (error) {
		console.log(error);
		throw error;
	}
});

test('get order status', async () => {
	try {
		const res = await gogovan.getOrderStatus('0000');
		console.log(res);
		expect(res.data.success).toBe(true);
	} catch (error) {
		console.log(error);
		throw error;
	}
});

test('get wallet balance', async () => {
	try {
		const res = await gogovan.getWalletBalance();
		console.log(res);
		expect(res.data.success).toBe(true);
	} catch (error) {
		console.log(error);
		throw error;
	}
});
