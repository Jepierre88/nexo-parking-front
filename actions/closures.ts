"use server";
import { CONSTANTS } from "@/config/constants";
import axios from "axios";

export async function getClosuresAction({
  from,
  to,
  page,
}: {
  from?: string;
  to?: string;
  page?: string;
}) {
  try {
    console.log("Fetching closures")
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
      page: page ?? 1,
    }

    const closures = await axios.get(
      `${CONSTANTS.APIURL}/payment-closures`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...searchParams,
        }
      },
    )

    // console.log("closures", closures.data)


    return {
      closures: closures.data.data, meta: closures.data.meta
      // const incomes = await getIncomesFromDb(fromDate, toDate, plate ?? "");
    }// return incomes;
  } catch (error) {
    console.error("Error fetching closures:", error);
    throw error;
  }
}

export const postClosure = async (cashier: string) => {
  try {
    const response = await axios.post(
      `${CONSTANTS.APIURL}/payment-closure/${cashier}`
    );
    return response.data;
  } catch (error) {
    console.error("Error al realizar el cierre:", error);
    throw error;
  }
};

export const getClosureDetails = async (id: number) => {
  try {
    const response = await axios.get(
      `${CONSTANTS.APIURL}/payment-closure/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const postsendEmail = async (idClosure: number, email: string) => {
  try {
    const response = await axios.post(
      `${CONSTANTS.APIURL}/sendEmailPaymentClosure/${idClosure}`,
      { email }
    );
    return response.data;
  } catch (error) {
    console.error("Error al enviar el email:", error);
    throw error;
  }
};

