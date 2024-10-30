import axios from "axios";
import { useState } from "react";
import { IngresoSalida } from "@/types";

export default function UseIngresoSalida() {
  const [loading, setLoading] = useState(false);

  const ingresarSalida = async (data: IngresoSalida) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_LOCAL_APIURL}/access-control/visitor-service/generateContingency`,
        {
          ...data,
          datetime: data.datetime || new Date().toISOString(), // Si no se envía, se toma la actual
        }
      );
      console.log("Ingreso/Salida registrado:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al registrar ingreso/salida:", error);
    } finally {
      setLoading(false);
    }
  };

  return { ingresarSalida, loading };
}
