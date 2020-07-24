import axios from 'axios';

const client = axios.create({
	baseURL: 'https://some-domain.com/api/',
	timeout: 1000,
	headers: { 'X-Custom-Header': 'foobar' },
});

export class Gogovanplus {
	private email: string;
	private password: string;
	constructor(newEmail: string, newPassword: string) {
		this.email = newEmail;
		this.password = newPassword;
	}
}
