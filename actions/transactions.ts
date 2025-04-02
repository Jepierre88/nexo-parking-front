"use server";

import { CONSTANTS } from "@/config/constants";
import Transaction from "@/types/Transaction";
import axios from "axios";

export async function getTransactionsAction({
  from,
  to,
  plate,
  page,
}: {
  from?: string;
  to?: string;
  plate?: string;
  page?: string;
}) {
  try {
    console.log("Fetching transactions")
    let fromDate: Date;
    let toDate: Date;

    if (from && to) {
      fromDate = new Date(from);
      toDate = new Date(to);
    } else {
      // Set default range to current day
      const now = new Date();
      fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      toDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    }

    const searchParams = {
      from: fromDate.toISOString(),
      to: toDate.toISOString(),
      plate: plate ?? undefined,
      page: page ?? undefined,
    }

    const transactions = await axios.get(
      `${CONSTANTS.APIURL}/transactions`,
      {
        method: "GET",
        timeout: 500,
        headers: {
          "Content-Type": "application/json",
          ...searchParams,
        }
      },
    )


    return transactions.data
    // const incomes = await getIncomesFromDb(fromDate, toDate, plate ?? "");
    // return incomes;
  } catch (error) {
    // console.error("Error en getIncomesAction", error);
    // lets do a fake response itering an array to generate objects like the below one
    const transactions: Transaction[] = Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      cashier: `Cashier ${i + 1}`,
      code: `TRX${1000 + i}`,
      consecutive: String(i + 1), // Convert to string
      datetime: new Date().toISOString(), // Convert to string
      identificationMethod: "QR",
      namePaymentPoint: `Payment Point ${i + 1}`,
      namePaymentType: i % 2 === 0 ? "Cash" : "Credit Card",
      total: 1000 + (i * 100), // Keep as number
      transactionConcept: "PARKING_FEE",
      vehicleParkingTime: `${(i + 1) * 30}M`,
      vehiclePlate: `ABC${100 + i}`,
      vehicleType: "Car" // Corrected from vehicleTypets
    }));

    console.log("Fake response", transactions)
    return transactions
  }
}
