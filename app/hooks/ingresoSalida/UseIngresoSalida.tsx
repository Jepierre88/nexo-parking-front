import { CONSTANTS } from "@/config/constants";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import { toast } from "sonner";

export default function UseIngresoSalida() {
  const [loading, setLoading] = useState(false);

  const outcomeManual = async (qr: string, plate: string) => {
    if ((!qr && !plate) || (qr.trim().length === 0 && plate.trim().length === 0)) {
      toast.error("No se proporcionó la placa ni el QR");
      return null;
    }
    // if ((!qr && !plate) || (qr.trim().length === 0 && plate.trim().length === 0)) {
    //   toast.error("Error: La placa es inválida o no se proporcionó.");
    //   return null;
    // }

    setLoading(true);
    console.log(Cookies.get("auth_token"));
    try {
      const response = await axios.post(
        `${CONSTANTS.APIURL}/generateManualOutcome`,
        {
          plate,
          qr
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("auth_token")}`,
          },
        }
      );

      toast.success("Salida manual generada con éxito.");
      return response.data;
    } catch (error: any) {
      let errorMsg = "Error al registrar la salida.";
      if (error instanceof AxiosError) {
        errorMsg = error.response?.data.message || errorMsg;
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
