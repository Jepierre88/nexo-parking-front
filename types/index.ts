import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
	size?: number;
};

export interface User{

	cellPhoneNumber:      string;
	departmentName:       string;
	email:                string;
	emailVerified:        boolean;
	generalEntityId:      number;
	id:                   string;
	lastName:             string;
	name:                 string;
	privacyAuthorization: boolean;
	realm:                string;
	resetKey:             string;
	username:             string;
	verificationToken:    string;
	zoneId:               number;  

}
export interface Signup{
	password: 			   string;
	cellPhoneNumber:      string;
	email:                string;
	lastName:             string;
	name:                 string;
	realm:                string;
	username:             string;
}

export interface Email{
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
