import { CONSTANTS } from "@/config/constants";
import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import { number } from "zod";

export default function UseValidate() {
  const [loadingValidate, setLoadingValidate] = useState(false);

  const validate = async (
    customType: string,
    identificationType: string,
    identificationCode: string,
    plate: string,
    discountCode: string,
    isApportionment: boolean,
    monthsForPay: number,
    apportionmentStartDatetime?: string,
    apportionmentEndDatetime?: string
  ) => {
    setLoadingValidate(true);
    try {
      const response = await axios.post(
        `${CONSTANTS.APIURL}/validatePaymentVisitorService`,
        {
          identificationType,
          identificationCode,
          plate,
          discountCode,
          isApportionment,
          customType,
          monthsForPay,
          apportionmentStartDatetime,
          apportionmentEndDatetime,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("auth_token")}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Error al consultar la información"
      );
    } finally {
      setLoadingValidate(false);
    }
  };

  return { validate, loadingValidate };
}
