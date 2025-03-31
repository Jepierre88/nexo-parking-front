import { CONSTANTS } from "@/config/constants";
import { parseAbsoluteToLocal } from "@internationalized/date";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Income {
  id: number;
  realm?: string;
  plate: string;
  vehicleKind: string;
  datetime: Date;
}

export default function UseIncomes() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const today = new Date();
  const todayNight = new Date();

  today.setHours(0, 0, 0);
  todayNight.setHours(23, 59, 59);
  useEffect(() => {
    setLoading(true);
    getIncomes(today, todayNight);
    return () => { };
  }, []);

  const getIncomes = async (
    startDateTime?: Date,
    endDateTime?: Date,
    plate?: string
  ) => {
    setLoading(true);

    try {
      const response = await axios.get(
        `${CONSTANTS.APIURL}/incomes/pp`,
        {
          params: {
            startDateTime: startDateTime?.toISOString(),
            endDateTime: endDateTime?.toISOString(),
            plate: plate?.toString(),
          },
        }
      );
      const arrayfilter: Income[] = response.data;

      setIncomes(
        arrayfilter.filter(
          (item) => item.realm !== "Consultorio" && item.realm !== "consultorio"
        )
      );
    } catch (error) {
      console.error("Error al obtener ingresos: ", error);
      setIncomes([]);
    } finally {
      setLoading(false);
    }
  };

  const updatePlate = async (id: string, plate: string) => {
    setLoading(true);
    try {
      const response = await axios.patch(
        `${CONSTANTS.APIURL}/incomes/${id}`,
        {
          plate,
        }
      );

      console.log("Placa actualizada:", response.data);
    } catch (error) {
      console.error("Error actualizando la placa: ", error);
    } finally {
      setLoading(false);
    }
  };
  const [currentDate, setCurrentDate] = useState<any>(
    parseAbsoluteToLocal(new Date().toISOString())
  );
  const updateIncome = async (income: Income): Promise<Income | null> => {
    setLoading(true);
    try {
      const response = await axios.patch(
        `${CONSTANTS.APIURL}/incomes/${income.id}`,
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
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    incomes,
    loading,
    getIncomes,
    updatePlate,
    setIncomes,
    updateIncome,
  };
}
