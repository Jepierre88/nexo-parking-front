
export default interface Closure {
    description?: Description[];
	datetime?: any;
	id?: number;
    initialConsecutive?: number;
    finalConsecutive?: number;
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

    limit?: number;
    paymentPoint?: string;
    fromDatetime?: any;
    toDatetime?: any;
    transactionType?:string;
    transactionData?:string;
    transaction?:string;

}

interface Description {
    Item:number;
	CANTIDAD: number;
	TOTAL: number;
}


export interface Encabezado {
    fromDatetime: string;
    toDatetime: string;
  }
  
  export interface Transaction {
    transactionType: string;
    items: {
      code: string;
      cnt: number;
      total: number;
    }[];
    total: number;
  }
  
  export interface PaymentSummary {
    paymentMethods: {
      item: string;
      cantidad: number;
      total: number;
    }[];
    totalPaymentMethods: number;
    amountReceived: {
      item: string;
      cantidad: number;
      total: number;
    }[];
    totalAmountReceived: number;
    amountToReturn: {
      item: string;
      cantidad: number;
      total: number;
    }[];
    totalAmountToReturn: number;
  }
  

  export type CierreData = [Closure, Encabezado, Transaction[], PaymentSummary];
  
