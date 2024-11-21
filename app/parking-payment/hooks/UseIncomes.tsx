import axios from "axios";
import { useEffect, useState } from "react";

interface Income {
  id: string;
  realm: string;
  plate: string;
}

export default function UseIncomes() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const today = new Date();
  const todayNight = new Date();

  today.setHours(0, 0, 0);
  todayNight.setHours(23, 59, 59);

  console.log(today.toISOString());
  useEffect(() => {
    setLoading(true);
    getIncomes(today, todayNight);
    return () => {};
  }, []);

  const getIncomes = async (startDateTime?: Date, endDateTime?: Date) => {
    setLoading(true);

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_LOCAL_APIURL}/incomes/pp`,
        {
          params: {
            startDateTime: startDateTime?.toISOString(),
            endDateTime: endDateTime?.toISOString(),
          },
        }
      );

      console.log(response.data);
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
        `${process.env.NEXT_PUBLIC_LOCAL_APIURL}/incomes/${id}`,
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

  return { incomes, loading, getIncomes, updatePlate, setIncomes };
}
