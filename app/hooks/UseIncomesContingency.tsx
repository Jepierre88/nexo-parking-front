import axios from "axios";
import { useState } from "react";
import { enterExit } from "@/types";
import IncomeContingency from "@/types/IncomeContingency";

export default function UseIncomesContingency() {
  const [loading, setLoading] = useState(false);

  const enterExit = async (data: enterExit) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_LOCAL_APIURL}/access-control/visitor-service/generateContingency`,
        {
          ...data,
          datetime: data.datetime || new Date().toISOString(),
        }
      );

      if (response?.data) {
        console.log("Ingreso registrado:", response.data);
        return response.data;
      } else {
        throw new Error("La respuesta de la API es inválida.");
      }
    } catch (error) {
      console.error("Error al registrar ingreso:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getIdentificationIdByPlate = async (
    plate: string
  ): Promise<string | null> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_LOCAL_APIURL}/incomes/pp`,
        {
          params: {
            plate,
          },
        }
      );
      const arrayfilter: IncomeContingency[] = response.data;

      const income = arrayfilter.find((item) => item.plate === plate);
      return income?.identificationId || null;
    } catch (error) {
      console.error("Error al obtener el QR por placa: ", error);
      return null;
    }
  };

  return { enterExit, getIdentificationIdByPlate, loading };
}
