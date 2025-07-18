import { PaymentData } from "@/types";

export const initialPaymentData: PaymentData = {
	identificationCode: "",
	IVAPercentage: 0,
	IVATotal: 0,
	concept: "",
	datetime: "",
	deviceId: 0,
	discountCode: "",
	discountTotal: 0,
	grossTotal: 0,
	identificationType: "",
	isSuccess: false,
	messageBody: "",
	messageTitle: "",
	optionalFields: [],
	plate: "",
	plateImage: "",
	requiredFields: [],
	status: 0,
	subtotal: 0,
	total: 0,
	customType: "",
	validationDetail: {
		expectedOutcomeDatetime: "",
		validationDatetime: "",
		timeInParking: "",
		processId: 0,
		incomeDatetime: "--",
		paidDatetime: "--",
	},
	vehicleKind: "",
	selectedService: undefined, // Si es opcional
	extraServices: [],
	cashier: "",
	customerIdentificationNumber: "",

};
