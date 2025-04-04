"use server";

import { CONSTANTS } from "@/config/constants";
import axios from "axios";

export async function getOutcomesAction({
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
    console.log("Fetching outcomes")
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

    const outcomes = await axios.get(
      `${CONSTANTS.APIURL}/outcomes`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...searchParams,
        }
      },
    )

    console.log(searchParams)

    console.log("outcomes", outcomes.data)


    return {
      outcomes: outcomes.data.data, meta: outcomes.data.meta
    }
    // const incomes = await getIncomesFromDb(fromDate, toDate, plate ?? "");
    // return incomes;
  } catch (error) {
    throw error;
  }
}
