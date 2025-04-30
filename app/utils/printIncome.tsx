import { CONSTANTS } from "@/config/constants";
import axios from "axios";
import Cookies from "js-cookie";

export const printIncome = async (ticketId: string, token: string) => {
  const response = await axios.get(
    `${CONSTANTS.APIURL}/printIncomeId`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        id: ticketId
      },
    }
  );
  return response.data;
};
