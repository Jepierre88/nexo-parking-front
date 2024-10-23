import axios from "axios";
import { useEffect, useState } from "react";

export default function UseListsPaymentMethods(type: string) {
  const [namePaymentType, setnamePaymentType] = useState<any[]>([]);
  const getnamePaymentType = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_LOCAL_APIURL}/listPaymentsTypes`,
        {
          params: {
            namePaymentType: type,
          },
        }
      );
      console.log("Datos recibidos:", response.data);
      setnamePaymentType(response.data);
    } catch (error) {
      setnamePaymentType([]);
      console.error(error);
    }
  };
  useEffect(() => {
    getnamePaymentType();
  }, []);

  return {
    namePaymentType,
    getnamePaymentType,
  };
}
