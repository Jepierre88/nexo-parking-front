export default interface Transaction {
	cashier: string;
	identificationId: string;
	consecutive: string;
	datetime: string;
	id: number;
	identificationMethod: string;
	namePaymentPoint: string;
	namePaymentType: string;
	total: number;
	transactionConcept: string;
	vehicleParkingTime: string;
	vehiclePlate: string;
	vehicleType: string;
}
