import axios from "axios";
import { useEffect, useState } from "react";
import { Closure } from "@/types/Closure";
import { toast } from "sonner";
import { CONSTANTS } from "@/config/constants";
import Cookies from "js-cookie";

export default function UseClosure() {
  const [closure, setClosure] = useState<Closure[]>([]);
  const [closureDetails, setClosureDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const today = new Date();
  const todayNight = new Date();
  today.setHours(0, 0, 0);
  todayNight.setHours(23, 59, 59);

  useEffect(() => {
    setLoading(true);
    getClosure(today, todayNight);
  }, []);

  const getClosure = async (
    startDateTime?: Date,
    endDateTime?: Date,
    limit: number = 10
  ) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${CONSTANTS.APIURL}/payment-closures`,
        {
          params: {
            limit,
            startDateTime: startDateTime?.toISOString(),
            endDateTime: endDateTime?.toISOString(),
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("auth_token")}`,
          },
        }
      );

      setClosure(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error al obtener los cierres:", error);
      setClosure([]);
    } finally {
      setLoading(false);
    }
  };

  const getClosureDetails = async (id: number) => {
    setLoadingDetails(true);
    try {
      const response = await axios.get(
        `${CONSTANTS.APIURL}/payment-closuresNewPP/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("auth_token")}`,
          },
        }
      );
      return response.data;
      setClosureDetails(response.data);
    } catch (error) {
      console.error("Error al obtener los detalles del cierre:", error);
      setClosureDetails(null);
    } finally {
      setLoadingDetails(false);
    }
  };

  const postClosure = async (cashier: string) => {
    setLoadingDetails(true);
    try {
      const response = await axios.post(
        `${CONSTANTS.APIURL}/payment-closuresNewPP/${cashier}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("auth_token")}`,
          },
        }
      );
      setClosureDetails(response.data);
      return response.data;
    } catch (error) {
      console.error("Error al realizar el cierre:", error);
      setClosureDetails(null);
      throw error;
    } finally {
      setLoadingDetails(false);
    }
  };

  const postsendEmail = async (idClosure: number, email: string) => {
    setLoadingDetails(true);
    try {
      const response = await axios.post(
        `${CONSTANTS.APIURL}/sendEmailPaymentClosure/${idClosure}`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("auth_token")}`,
          },
        }
      );
      setClosureDetails(response.data);
      return response.data;
    } catch (error) {
      console.error("Error al enviar el email:", error);
      toast.error("Error al enviar el email");
      setClosureDetails(null);
      throw error;
    } finally {
      setLoadingDetails(false);
    }
  };
  return {
    getClosure,
    getClosureDetails,
    postClosure,
    postsendEmail,
    closure,
    closureDetails,
    loading,
    loadingDetails,
  };
}
