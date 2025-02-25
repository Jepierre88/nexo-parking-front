import axios from "axios";
import { useEffect, useState } from "react";
import Closure from "@/types/Closure";

export default function UseClosure() {
  const [closure, setClosure] = useState<Closure[]>([]);
  const [loading, setLoading] = useState(true);
  const today = new Date();
  const todayNight = new Date();

  today.setHours(0, 0, 0);
  todayNight.setHours(23, 59, 59);

  useEffect(() => {
    setLoading(true);
    getClosure(today, todayNight);
  }, []);

  const getClosure = async (startDateTime?: Date, endDateTime?: Date) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_LOCAL_APIURL}/payment-closures`,
        {
          params: {
            startDateTime: startDateTime?.toISOString(),
            endDateTime: endDateTime?.toISOString(),
          },
        }
      );
      const arrayfilter: Closure[] = Array.isArray(response.data)
        ? response.data
        : [];
      setClosure(arrayfilter);
    } catch (error) {
      console.error("Error al obtener los Cierres:", error);
      setClosure([]);
    } finally {
      setLoading(false);
    }
  };
  return {
    getClosure,
    closure,
    loading,
  };
}
