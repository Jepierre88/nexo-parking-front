import { CONSTANTS } from "@/config/constants";
import { parseAbsoluteToLocal } from "@internationalized/date";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface outComes {
  id: number;
  realm?: string;
  plate: string;
  vehicleKind: string;
  datetime: Date;
}

export default function UseOutcomes() {
  const [outComes, setOutComes] = useState<outComes[]>([]);
  const [loading, setLoading] = useState(true);
  const today = new Date();
  const todayNight = new Date();

  today.setHours(0, 0, 0);
  todayNight.setHours(23, 59, 59);
  useEffect(() => {
    setLoading(true);
    getOutComes(today, todayNight);
    return () => { };
  }, []);

  const getOutComes = async (
    startDateTime?: Date,
    endDateTime?: Date,
    plate?: string
  ) => {
    setLoading(true);

    try {
      const response = await axios.get(
        `${CONSTANTS.APIURL}/outcomes/pp`,
        {
          params: {
            startDateTime: startDateTime?.toISOString(),
            endDateTime: endDateTime?.toISOString(),
            plate: plate?.toString(),
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("auth_token")}`,
          },
        }
      );
      const arrayfilter: outComes[] = response.data;

      setOutComes(
        arrayfilter.filter(
          (item) => item.realm !== "Consultorio" && item.realm !== "consultorio"
        )
      );
    } catch (error) {
      console.error("Error al obtener ingresos: ", error);
      setOutComes([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    outComes,
    getOutComes,
  };
}
