import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
	size?: number;
};

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

export interface PaymentData {
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
	selectedService?: any;
	totalParking?: number;
	totalServices?: number;
	services?: any[];
	netTotal?: number;
	totalCost?: number;
	extraServices: any[];
}

export interface ValidationDetail {
	validationDatetime: string;
	timeInParking: string;
	processId: number;
	incomeDatetime: string;
	paidDatetime: string;
	expectedOutcomeDatetime: string;
}
