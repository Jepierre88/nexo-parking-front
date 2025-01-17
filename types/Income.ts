export default interface Ingreso {
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
