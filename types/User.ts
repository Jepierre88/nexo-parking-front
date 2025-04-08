import Signup from "./Auth";

export default interface User {
	cellPhoneNumber: string;
	departmentName: string;
	email: string;
	emailVerified: boolean;
	generalEntityId: number;
	id: string;
	lastName: string;
	name: string;
	privacyAuthorization: boolean;
	realm: string;
	resetKey: string;
	username: string;
	verificationToken: string;
	zoneId: number;
	permissions: [];
	deviceNme: string;
	eliminated: boolean;
}

export const initialUserEdit: User = {
	cellPhoneNumber: "",
	departmentName: "",
	email: "",
	emailVerified: false,
	generalEntityId: 0,
	id: "",
	lastName: "",
	name: "",
	privacyAuthorization: false,
	realm: "",
	resetKey: "",
	username: "",
	verificationToken: "",
	zoneId: 0,
	permissions: [],
	deviceNme: "",
	eliminated: false,
}

export const initialNewUser: Signup = {
	username: "",
	password: "",
	email: "",
	name: "",
	lastName: "",
	cellPhoneNumber: "",
	realm: "",
	permissions: [],
}

export interface Rol {
	id: number;
	name: string;
	eliminated: boolean;
}