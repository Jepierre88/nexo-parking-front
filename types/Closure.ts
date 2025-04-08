export interface Closure {
  id: number;
  datetime?: Date;
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
  paymentPoint?: string;
  fromDatetime?: Date;
  toDatetime?: Date;
  transactions?: Transaction[];
  endDatetime?: Date;
}

export interface Transaction {
  transactionType: string;
  items: TransactionItem[];
  total: number;
}

export interface TransactionItem {
  code: string;
  cnt: number;
  total: number;
}

export interface PaymentMethodSummary {
  item: string;
  cantidad: number;
  total: number;
}

export interface ClosureDetails {
  id?: number;
  paymentMethods: PaymentMethodSummary[];
  totalPaymentMethods: number;
  amountReceived: PaymentMethodSummary[];
  totalAmountReceived: number;
  amountToReturn: PaymentMethodSummary[];
  totalAmountToReturn: number;
}

export interface Encabezado {
  fromDatetime: string;
  toDatetime: string;
}

export type ClosureData = [Encabezado, Transaction[], ClosureDetails];
