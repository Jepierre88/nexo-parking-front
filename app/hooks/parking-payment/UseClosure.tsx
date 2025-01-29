import axios from "axios";
import { useEffect, useState } from "react";
import Closure from "@/types/Closure";

export default function UseClosure() {
  const [closure, setClosure] = useState<Closure[]>([]);
  const [loading, setLoading] = useState(true);

  const getClosure = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_LOCAL_APIURL}/payment-closures`
      );
      const arrayfilter: Closure[] = Array.isArray(response.data)
        ? response.data
        : [];
      setClosure(arrayfilter);
      console.log(closure);
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
