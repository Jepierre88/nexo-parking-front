import axios from "axios";
import { useEffect, useState } from "react";

export default function UseServices(type: string) {
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const getServices = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_LOCAL_APIURL}/services`,
        {
          params: {
            serviceType: type,
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
    return () => {};
  }, []);

  return {
    services,
    getServices,
    isLoading,
  };
}
