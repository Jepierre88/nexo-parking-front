export default interface Outcome {
  datetime?: any;
  id: number;
  identificationId: string;
  identificationMethod: string;
  outcomePointId: number;
  peopleAmount: number;
  plate: string;
  plateImage: string;
  processId: number;
  state: number;
  vehicle: string;
  vehicleKind: string;
}
