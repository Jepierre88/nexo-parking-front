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
      from: fromDate.toISOString(),
      to: toDate.toISOString(),
      plate: plate ?? undefined,
      page: page ?? undefined,
    }

    const outcomes = await axios.get(
      `${CONSTANTS.APIURL}/outcomes`,
      {
        method: "GET",
        timeout: 500,
        headers: {
          "Content-Type": "application/json",
          ...searchParams,
        }
      },
    )

    const outcomesFake = Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      datetime: new Date().toISOString(),
      state: 0,
      identificationMethod: "CC",
      identificationId: "1152442957",
      vehicle: "",
      vehicleKind: "MOTO",
      plate: "CCC13D",
      plateImage: "C://COINS/img/20230117/11/1673956243552.jpg",
      peopleAmount: null,
      processId: 465,
      incomePointId: null,
    }));


    return outcomesFake
    // const incomes = await getIncomesFromDb(fromDate, toDate, plate ?? "");
    // return incomes;
  } catch (error) {
    // console.error("Error en getIncomesAction", error);
    // lets do a fake response itering an array to generate objects like the below one
    const outcomes = Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      datetime: new Date().toISOString(),
      state: 0,
      identificationMethod: "CC",
      identificationId: "1152442957",
      vehicle: "",
      vehicleKind: "MOTO",
      plate: "CCC13D",
      plateImage: "C://COINS/img/20230117/11/1673956243552.jpg",
      peopleAmount: null,
      processId: 465,
      incomePointId: null,
    }));
    console.log("Fake response", outcomes)
    return outcomes
  }
}
