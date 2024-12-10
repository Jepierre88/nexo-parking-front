export default interface PaymentGenerate {
	identificationType: string;
	identificationCode: string;
	plate: string;
	vehicleKind: string;
	discountCode: string;
	datetime: string;
	cashier: string;
	concept: string;
	IVAPercentage: number;
	IVATotal: number;
	total: number;
	cashValue: number;
	discountTotal: number;
	processId: number;
	paymentType: number;
	processPaidDatetime: string;
	customerIdentificationNumber?: string;
	vehicleParkingTime: string;
	extraServices: any;
}

interface ExtraServiceGenerate {}
