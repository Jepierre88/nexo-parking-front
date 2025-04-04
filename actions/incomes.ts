"use server";
import * as XLSX from 'xlsx';
import { CONSTANTS } from "@/config/constants";
import { parseAbsoluteToLocal } from "@internationalized/date";
import axios from "axios";
import Income from '@/types/Income';

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
        }
      },
    )

    console.log(searchParams)


    return { incomes: incomes.data.data, meta: incomes.data.meta }
    // const incomes = await getIncomesFromDb(fromDate, toDate, plate ?? "");
    // return incomes;
  } catch (error) {
    console.error("Error fetching incomes:", error);
    throw error;
  }
}

//TODO Organizar en el back el endpoint
export const updateIncome = async (income: Income): Promise<Income | null> => {
  try {
    const response = await axios.patch(
      `${CONSTANTS.APIURL}/income/${income.id}`,
      {
        datetime: income.datetime || new Date().toISOString(),
        vehicleKind: income.vehicleKind,
        plate: income.plate,
      }
    );

    console.log("Ingreso actualizado:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el ingreso:", error);
    throw error;
  }
};