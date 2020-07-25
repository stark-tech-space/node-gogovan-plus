import axios, { AxiosInstance, AxiosResponse } from 'axios';

type Vehicle = 'motorcycle' | 'struck' | 'mtruck';

interface GetPriceParams {
	booth: boolean;
	carry: boolean;
	locations: string[][]; //[['latitude (optional)', 'longitude (optional)', 'google maps address (required)', 'address extra info (floor/suite optional)']]
	pickup_time: string; //"2019/10/25 00:00"
	vehicle: Vehicle; //(motorcycle\struck\mtruck)
}

interface GetPriceRequest {
	email: string;
	password: string;
	data: {
		order: {
			booth: boolean;
			carry: boolean;
			locations: string[][]; //[['latitude (optional)', 'longitude (optional)', 'google maps address (required)', 'address extra info (floor/suite optional)']]
			pickup_time: string; //"2019/10/25 00:00"
			vehicle: Vehicle; //(motorcycle\struck\mtruck)
		};
	};
}

interface GetPriceResponse extends AxiosResponse {
	data: {
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
	pickup_time: string; //"2019/10/25 00:00"
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

interface CreateOrderResponse extends AxiosResponse {
	data: {
		success: boolean;
		order_id: number;
		price: number;
	};
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

interface CancelOrderResponse extends AxiosResponse {
	data: {
		success: boolean;
		msg: string | undefined;
	};
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

interface GetOrderStatusResponse extends AxiosResponse {
	data: {
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
	};
}

interface GetWalletBalanceRequest {
	email: string;
	password: string;
}

interface GetWalletBalanceResponse extends AxiosResponse {
	data: {
		success: boolean;
		msg: string | null;
		amount: number;
		bonus: number;
	};
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
	private client: AxiosInstance;
	constructor(newEmail: string, newPassword: string, endpointURL: string) {
		this.email = newEmail;
		this.password = newPassword;
		this.client = axios.create({
			baseURL: endpointURL,
		});
	}

	getPrice = async (params: GetPriceParams) => {
		try {
			return await this.client.get<GetPriceRequest, GetPriceResponse>(
				'api/order/price',
				{
					params: {
						email: this.email,
						password: this.password,
						...params,
					},
				}
			);
		} catch (error) {
			if (error && error.response) {
				return error.response;
			}

			throw error;
		}
	};

	createOrder = async (params: CreateOrderParams) => {
		try {
			return await this.client.post<CreateOrderRequest, CreateOrderResponse>(
				'api/order/new',
				{
					email: this.email,
					password: this.password,
					...params,
				}
			);
		} catch (error) {
			if (error && error.response) {
				return error.response;
			}

			throw error;
		}
	};

	cancelOrder = async (params: CancelOrderParams) => {
		try {
			return await this.client.put<CancelOrderRequest, CancelOrderResponse>(
				'api/order/cancel',
				{
					email: this.email,
					password: this.password,
					...params,
				}
			);
		} catch (error) {
			if (error && error.response) {
				return error.response;
			}

			throw error;
		}
	};

	getOrderStatus = async (id: string) => {
		try {
			return await this.client.get<
				GetOrderStatusRequest,
				GetOrderStatusResponse
			>(`api/order/${id}/status`, {
				params: {
					email: this.email,
					password: this.password,
				},
			});
		} catch (error) {
			if (error && error.response) {
				return error.response;
			}

			throw error;
		}
	};

	getWalletBalance = async () => {
		try {
			return await this.client.get<
				GetWalletBalanceRequest,
				GetWalletBalanceResponse
			>('api/wallet-balance', {
				params: {
					email: this.email,
					password: this.password,
				},
			});
		} catch (error) {
			if (error && error.response) {
				return error.response;
			}

			throw error;
		}
	};
}
