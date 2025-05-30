"use server";
import * as XLSX from 'xlsx';
import { CONSTANTS } from "@/config/constants";
import { parseAbsoluteToLocal } from "@internationalized/date";
import axios, { AxiosError } from "axios";
import Income, { PrintIncome } from '@/types/Income';
import { cookies } from 'next/headers';

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
  const cookieStore = cookies();

  const token = (await cookieStore).get('auth_token')?.value;
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
      startDateTime: fromDate.toISOString(),
      endDateTime: toDate.toISOString(),
      plate: plate ?? undefined,
      page: page ?? 1,
    }

    const incomes = await axios.get(
      `${CONSTANTS.APIURL}/incomes/pp`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...searchParams,
          Authorization: `Bearer ${token}`,
        }
      },
    )

    console.log(incomes.data.data)

    // await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate a 2-second delay for the respons

    return { incomes: incomes.data.data, meta: incomes.data.meta }
    // const incomes = await getIncomesFromDb(fromDate, toDate, plate ?? "");
    // return incomes;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error.response?.data)
      throw error
    }
    console.error("Error fetching incomes:", error);
    throw error;
  }
}

//TODO Organizar en el back el endpoint
export const updateIncome = async (income: Income): Promise<Income | null> => {
  const cookieStore = cookies();

  const token = (await cookieStore).get('auth_token')?.value;

  try {
    const response = await axios.put(
      `${CONSTANTS.APIURL}/income/${income.id}`,
      {
        // datetime: income.datetime || new Date().toISOString(),
        // vehicleKind: income.vehicleKind,
        plate: income.plate,
      }, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
    );
    // await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate a 2-second delay for the respons
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el ingreso:", error);
    throw error;
  }
};

export const generateReport = async ({
  from, to
}: {
  from?: string;
  to?: string;
}): Promise<any[]> => {
  const cookieStore = cookies();

  const token = (await cookieStore).get('auth_token')?.value;

  try {

    console.log(from, to)

    const response = await axios.get(
      //TODO Cambiar endpoint
      `${CONSTANTS.APIURL}/incomesReport/pp`,
      {
        headers: {
          startDateTime: from,
          endDateTime: to,
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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


export const getIncomeForPrint = async (id: number): Promise<PrintIncome> => {
  const cookieStore = cookies();
  const token = (await cookieStore).get('auth_token')?.value;
  try {
    const response = await axios.get(
      `${CONSTANTS.APIURL}/printIncomeId`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          id
        },
      }
    )
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error.response?.data)
      throw error
    }
    if (error instanceof AxiosError) {
      console.log(error.response?.data)
      throw error
    }
    throw error;
  }
}
