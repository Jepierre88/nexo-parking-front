"use server";

import { CONSTANTS } from "@/config/constants";
import { parseAbsoluteToLocal } from "@internationalized/date";
import axios from "axios";

export async function getIncomesAction({
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
    console.log("Fetching incomes")
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

    const incomes = await axios.get(
      `${CONSTANTS.APIURL}/incomes`,
      {
        method: "GET",
        timeout: 500,
        headers: {
          "Content-Type": "application/json",
          ...searchParams,
        }
      },
    )


    return incomes.data

    // const incomes = await getIncomesFromDb(fromDate, toDate, plate ?? "");
    // return incomes;
  } catch (error) {
    // console.error("Error en getIncomesAction", error);
    return [];
  }
}
