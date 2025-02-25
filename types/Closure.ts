
export default interface Closure {
	datetime?: any;
	id: number;
    initialConsecutive: number;
    finalConsecutive: number;
    cashier?: string;
    paymentPointId?: number;
    internalId?: number;
    bill1Denomination?: number;
    bill2Denomination?: number;
    coin1Denomination?: number;
    coin2Denomination?: number;
    bill1Amount?: number;
    bill2Amount?: number;
    coin1Amount?: number;
    coin2Amount?: number;

}
