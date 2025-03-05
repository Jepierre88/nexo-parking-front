import axios from "axios";
import { useEffect, useState } from "react";
import { Closure } from "@/types/Closure";
import { toast } from "sonner";

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
        `${process.env.NEXT_PUBLIC_LOCAL_APIURL}/payment-closuresNewPP`,
        {
          params: {
            limit,
            startDateTime: startDateTime?.toISOString(),
            endDateTime: endDateTime?.toISOString(),
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
        `${process.env.NEXT_PUBLIC_LOCAL_APIURL}/payment-closuresNewPP/${id}`
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
        `${process.env.NEXT_PUBLIC_LOCAL_APIURL}/payment-closuresNewPP/${cashier}`
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
        `${process.env.NEXT_PUBLIC_LOCAL_APIURL}/sendEmailNewPP/${idClosure}`,
        { email }
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
