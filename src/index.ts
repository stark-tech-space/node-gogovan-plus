import axios from 'axios';

export class Gogovanplus {
	private email: string;
	private password: string;
	constructor(newEmail: string, newPassword: string) {
		this.email = newEmail;
		this.password = newPassword;
	}
}
