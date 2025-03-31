import { CONSTANTS } from "@/config/constants";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

export default function UseIngresoSalida() {
  const [loading, setLoading] = useState(false);

  const outcomeManual = async (plate: string) => {
    if (!plate || plate.trim().length === 0) {
      toast.error("Error: La placa es inválida o no se proporcionó.");
      return null;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${CONSTANTS.APIURL}/zone-management/access-control/generateManualOutcome/${plate}`
      );

      toast.success("Salida manual generada con éxito.");
      return response.data;
    } catch (error: any) {
      let errorMsg = "Error al registrar la salida.";
      if (error.response?.data?.error?.message) {
        errorMsg = error.response.data.error.message;
      }
      toast.error(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    outcomeManual,
    loading,
  };
}
