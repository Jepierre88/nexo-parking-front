export default interface Income {
	datetime?: any;
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


export interface PrintIncome {
	data: Income;
	printInformation: {
		privacyPolicyInfo: string;
		endDatePolicy: string;
		paymentPointInfo: string
	}
}