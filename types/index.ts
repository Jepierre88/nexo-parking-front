import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
	size?: number;
};

export interface User {
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
}
export interface Signup {
	password: string;
	cellPhoneNumber: string;
	email: string;
	lastName: string;
	name: string;
	realm: string;
	username: string;
}

export interface Email {
	email: string;
}

export interface IngresoSalida {
	identificationType: "QR";
	plate: string;
	vehicleKind: "CARRO" | "MOTO";
	datetime?: string;
	incomeConditionType: "Visitor" | "Event" | "Courtesy";
	incomeConditionDetail: string;
}

export interface UserData {
	IVAPercentage: number;
	IVATotal: number;
	concept: string;
	datetime: string;
	deviceId: number;
	discountCode: string;
	discountTotal: number;
	grossTotal: number;
	identificationCode: string;
	identificationType: string;
	isSuccess: boolean;
	messageBody: string;
	messageTitle: string;
	optionalFields: any[];
	plate: string;
	plateImage: string;
	requiredFields: any[];
	status: number;
	subtotal: number;
	total: number;
	validationDetail: ValidationDetail;
	vehicleKind: string;
}

export interface ValidationDetail {
	validationDatetime: string;
	timeInParking: string;
	processId: number;
	incomeDatetime: string;
	paidDateTime: string;
	expectedOutComeDatetime: string;
}
export interface Transaction {
	cashier: string;
	code: string;
	consecutive: string;
	datetime: string;
	id: number;
	namePaymentPoint: string;
	namePaymentType: string;
	total: number;
	transactionConcept: string;
	vehicleParkingTime: string;
	vehiclePlate: string;
}

export interface Factura {
	description: Description[];
	direccion: string;
	empresa: string;
	header: Header;
	infoCufe: InfoCufe;
	infoPolice: string;
	infoResolution: string;
	infoSoftwareManufacturer: string;
	infoTechnologyProvider: string;
	nit: string;
}

export interface Description {
	BASE: number;
	CAMBIO: number;
	CANTIDAD: number;
	CANTIDAD_TOTAL: number;
	DESCRIPCION: string;
	DESCUENTO: number;
	IVA_19: number;
	RECIBIDO: number;
	SUBTOTAL: number;
	TOTAL: number;
	VALOR: number;
}

export interface Header {
	CLIENTE: string;
	DURACION: string;
	FACTURA_ELECTRONICA_DE_VENTA: string;
	FECHA_DE_INGRESO: Date;
	FECHA_DE_VENTA: string;
	FORMA_DE_PAGO: string;
	MEDIO_DE_PAGO: string;
	NIT: string;
	PLACA: string;
	PUNTO_DE_PAGO: string;
	REGIMEN: string;
}

export interface InfoCufe {
	CUFE: null;
	URL: null;
}

export interface Ingreso {
	datetime: Date;
	id: number;
	identificationId: string;
	identificationMethod: string;
	incomePointId: number;
	peopleAmount: number;
	plate: string;
	plateImage: string;
	processId: number;
	state: number;
	vehicle: string;
	vehicleKind: string;
}
