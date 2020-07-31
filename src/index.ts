import 'regenerator-runtime/runtime';
import phin from 'phin';
import format from 'date-fns/fp/format';

type Vehicle = 'motorcycle' | 'struck' | 'mtruck';

interface GetPriceParams {
	booth: boolean;
	carry: boolean;
	locations: string[][]; //[['latitude (optional)', 'longitude (optional)', 'google maps address (required)', 'address extra info (floor/suite optional)']]
	pickup_time: Date; // javascript date -> "2019/10/25 00:00"
	vehicle: Vehicle; //(motorcycle\struck\mtruck)
}

interface GetPriceRequest {
	email: string;
	password: string;
	data: {
		order: {
			booth: string; //"true" | "false"
			carry: string; //"true" | "false"
			locations: string[][]; //[['latitude (optional)', 'longitude (optional)', 'google maps address (required)', 'address extra info (floor/suite optional)']]
			pickup_time: string; //"2019/10/25 00:00"
			vehicle: Vehicle; //(motorcycle\struck\mtruck)
		};
	};
}

interface GetPriceResponse {
	success: boolean;
	msg: string;
	data: {
		breakdown: {
			fee: {
				title: string;
				value: number;
			};
		};
		distance_in_kms: string;
		travel_time: string; //seconds
		base: number;
		total: number;
		payment_method: string;
		wallet: {
			amount: string;
			bonus: string;
		};
	};
}

interface CreateOrderParams {
	booth: boolean;
	carry: boolean;
	cod_price: string;
	invoice?: {
		address: string; //invoice optional
		email: string;
		name: string;
		note: string;
		tax_id_no: string;
	};
	is_bonus_first: boolean;
	locations: string[][]; //[['latitude (optional)', 'longitude (optional)', 'google maps address (required)', 'address extra info (floor/suite optional)']]
	name: string;
	need_insulation_bags: boolean;
	note: string;
	phone_number: string;
	pickup_time: Date; // javascript date -> "2019/10/25 00:00"
	receiver_name: string;
	receiver_phone_number: string;
	vehicle: Vehicle;
}

interface CreateOrderRequest {
	email: string;
	password: string;
	data: {
		order: {
			booth: boolean;
			carry: boolean;
			cod_price: string;
			invoice: {
				address: string;
				email: string;
				name: string;
				note: string;
				tax_id_no: string;
			};
			is_bonus_first: boolean;
			locations: string[][]; //[['latitude (optional)', 'longitude (optional)', 'google maps address (required)', 'address extra info (floor/suite optional)']]
			name: string;
			need_insulation_bags: boolean;
			note: string;
			phone_number: string;
			pickup_time: string; //"2019/10/25 00:00"
			receiver_name: string;
			receiver_phone_number: string;
			vehicle: Vehicle;
		};
	};
}

interface CreateOrderResponse {
	success: boolean;
	order_id: number;
	price: number;
	msg?: string;
}

interface CancelOrderParams {
	action: 'cancel';
	order_id: string;
}

interface CancelOrderRequest {
	email: string;
	password: string;
	action: 'cancel';
	order_id: string;
}

interface CancelOrderResponse {
	success: boolean;
	msg: string | undefined;
}

interface GetOrderStatusRequest {
	email: string;
	password: string;
}

interface Waypoint {
	name: string;
	address: string;
	detail_address: string;
	lat: number;
	lon: number;
	contact_name: string;
	contact_phone_number: string;
	driver_arrived_at: string; //date isoString
}

interface GetOrderStatusResponse {
	id: number;
	status: 'pending' | 'picked' | 'active' | 'completed' | 'cancelled';
	name: string;
	phone_number: string;
	driver: {
		id: number;
		phone_number: string;
		name: string;
		license_plate: string;
		location: string | undefined; //"25.0737746,121.6007978"
	};
	waypoints: [Waypoint];
	msg?: string; //error message
}

interface GetWalletBalanceRequest {
	email: string;
	password: string;
}

interface GetWalletBalanceResponse {
	success: boolean;
	msg: string | null;
	amount: number;
	bonus: number;
}

export interface OrderStatusWebhookRequest<Array> {
	id: number;
	status: 'pending' | 'picked' | 'active' | 'completed' | 'cancelled';
	name: string;
	phone_number: string;
	driver: {
		id: number;
		phone_number: string;
		name: string;
		license_plate: string;
		location: string; //"25.0737746,121.6007978"
	};
	waypoints: [Waypoint];
}

export default class Gogovanplus {
	private email: string;
	private password: string;
	private baseURL: string;
	constructor(newEmail: string, newPassword: string, endpointURL: string) {
		this.email = newEmail;
		this.password = newPassword;
		this.baseURL = endpointURL;
	}

	/*
	{
						email: this.email,
						password: this.password,
						data: {
							order: {
								booth: !!booth ? 'true' : 'false',
								carry: !!carry ? 'true' : 'false',
								pickup_time: format('yyyy/MM/dd HH:mm')(pickup_time),
								...restParams,
							},
						},
					}
	*/

	getPrice = async (params: GetPriceParams) => {
		const { booth, carry, pickup_time, ...restParams } = params;
		const url = this.baseURL + '/api/order/price';
		const data = {
			email: this.email,
			password: this.password,
			data: {
				order: {
					booth: booth.toString(),
					carry: carry.toString(),
					pickup_time: format('yyyy/M/dd HH:mm')(pickup_time),
					...restParams,
				},
			},
		};
		try {
			const res = await phin<GetPriceResponse>({
				url,
				data,
				parse: 'json',
				timeout: 10000,
			});
			if (res.body.hasOwnProperty('success') && !res.body?.success) {
				throw res.body.msg;
			}

			return res.body;
		} catch (error) {
			if (error && error.response) {
				return error.response;
			}

			throw error;
		}
	};

	createOrder = async (params: CreateOrderParams) => {
		const {
			booth,
			carry,
			need_insulation_bags,
			pickup_time,
			...restParams
		} = params;
		const url = this.baseURL + '/api/order/new';
		const data = {
			email: this.email,
			password: this.password,
			data: {
				order: {
					booth: 'false',
					carry: 'false',
					need_insulation_bags: !!need_insulation_bags ? 'true' : 'false',
					pickup_time: format('yyyy/MM/dd HH:mm')(pickup_time),
					...restParams,
				},
			},
		};
		try {
			const res = await phin<CreateOrderResponse>({
				url,
				method: 'POST',
				data,
				parse: 'json',
				timeout: 10000,
			});

			if (res.body.hasOwnProperty('success') && !res.body?.success) {
				throw res.body.msg;
			}

			return res.body;
		} catch (error) {
			if (error && error.response) {
				return error.response;
			}

			throw error;
		}
	};

	cancelOrder = async (params: CancelOrderParams) => {
		const url = this.baseURL + '/api/order/cancel';
		const data = {
			email: this.email,
			password: this.password,
			...params,
		};
		try {
			const res = await phin<CancelOrderResponse>({
				url,
				method: 'PUT',
				data,
				parse: 'json',
				timeout: 10000,
			});
			if (res.body.hasOwnProperty('success') && !res.body?.success) {
				throw res.body.msg;
			}

			return res.body;
		} catch (error) {
			if (error && error.response) {
				return error.response;
			}

			throw error;
		}
	};

	getOrderStatus = async (id: string) => {
		const url = this.baseURL + `/api/order/${id}/status`;
		const data = {
			email: this.email,
			password: this.password,
		};
		try {
			const res = await phin<GetOrderStatusResponse>({
				url,
				data,
				parse: 'json',
				timeout: 10000,
			});

			if (res.body.hasOwnProperty('msg')) {
				throw res.body.msg;
			}

			return res.body;
		} catch (error) {
			if (error && error.response) {
				return error.response;
			}

			throw error;
		}
	};

	getWalletBalance = async () => {
		const url = this.baseURL + '/api/wallet-balance';
		const data = {
			email: this.email,
			password: this.password,
		};
		try {
			const res = await phin<GetWalletBalanceResponse>({
				url,
				data,
				parse: 'json',
				timeout: 10000,
			});
			if (res.body.hasOwnProperty('success') && !res.body?.success) {
				throw res.body.msg;
			}

			return res.body;
		} catch (error) {
			if (error && error.response) {
				return error.response;
			}

			throw error;
		}
	};
}
