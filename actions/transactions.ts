"use server";

import { CONSTANTS } from "@/config/constants";
import Transaction from "@/types/Transaction";
import axios from "axios";
import { cookies } from "next/headers";

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
  const cookieStore = cookies();

  const token = (await cookieStore).get('auth_token')?.value;

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
      startDateTime: fromDate.toISOString(),
      endDateTime: toDate.toISOString(),
      plate: plate ?? undefined,
      page: page ?? undefined,
    }

    const transactions = await axios.get(
      `${CONSTANTS.APIURL}/transactionPaymentPoint`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...searchParams,
          Authorization: `Bearer ${token}`,
        }
      },
    )

    console.log("transactions", transactions.data)


    return { transactions: transactions.data.data, meta: transactions.data.meta }
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
}
