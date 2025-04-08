import { CONSTANTS } from "@/config/constants";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export default function UseServices(type: string) {
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const getServices = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${CONSTANTS.APIURL}/services`,
        {
          headers: {
            type: type,
            Authorization: `Bearer ${Cookies.get("auth_token")}`,
          },
        }
      );

      setServices(response.data);
    } catch (error) {
      setServices([]);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getServices();

    return () => { };
  }, []);

  return {
    services,
    getServices,
    isLoading,
  };
}
