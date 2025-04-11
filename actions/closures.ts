"use server";
import { CONSTANTS } from "@/config/constants";
import axios from "axios";
import { cookies } from 'next/headers';

export async function getClosuresAction({
  from,
  to,
  page,
}: {
  from?: string;
  to?: string;
  page?: string;
}) {
  const cookieStore = cookies();
  const token = (await cookieStore).get('auth_token')?.value;

  try {
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
          Authorization: `Bearer ${token}`,
        },
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
  const cookieStore = cookies();
  const token = (await cookieStore).get('auth_token')?.value;

  try {
    const response = await axios.post(
      `${CONSTANTS.APIURL}/payment-closure/${cashier}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al realizar el cierre:", error);
    throw error;
  }
};

export const getClosureDetails = async (id: number) => {
  const cookieStore = cookies();
  const token = (await cookieStore).get('auth_token')?.value;

  try {
    const response = await axios.get(
      `${CONSTANTS.APIURL}/payment-closure/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const postsendEmail = async (idClosure: number, email: string) => {
  const cookieStore = cookies();
  const token = (await cookieStore).get('auth_token')?.value;

  try {
    const response = await axios.post(
      `${CONSTANTS.APIURL}/sendEmailPaymentClosure/${idClosure}`,
      { email },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al enviar el email:", error);
    throw error;
  }
};


export const generateReport = async ({
  from, to
}: {
  from?: string;
  to?: string;
}): Promise<any[]> => {
  try {
    const response = await axios.get(
      //TODO Cambiar endpoint
      `${CONSTANTS.APIURL}/generate-report`,
      {
        params: {
          startDateTime: from,
          endDateTime: to,
        },
      }
    );

    const data: any[] = response.data;
    return data
  } catch (error) {
    console.error("Error al generar el reporte:", error);
    throw error;
  }
}

