import { CONSTANTS } from "@/config/constants";
import axios from "axios";
import { useState } from "react";

export default function UseInformationList() {
  const [loading, setLoading] = useState(false);

  const listInformation = async (identificationCode: string) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${CONSTANTS.APIURL}/CustomerInformation/${identificationCode}`,
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Error al consultar la información"
      );
    } finally {
      setLoading(false);
    }
  };

  return { listInformation, loading };
}
