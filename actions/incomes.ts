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
  page?: number;
}) {
  try {
    console.log("Fetching incomes")
    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;

    const searchParams = {
      from: fromDate ? fromDate.toISOString() : undefined,
      to: toDate ? toDate.toISOString() : undefined,
      plate: plate ?? undefined,
      page: page ?? undefined,
    }

    const incomes = await axios.get(
      `${CONSTANTS.APIURL}/incomes`,
      {
        url: `${CONSTANTS.APIURL}/incomes`,
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
