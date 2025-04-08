import { CONSTANTS } from "@/config/constants";
import axios from "axios";

export const activateLicenseAction = async (license: string) => {
  try {
    const response = await axios.post(
      `${CONSTANTS.APIURL}/common/enter_license`,
      { license },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    return response.data;
  } catch (error) {
    console.error("Error al activar la licencia:", error);
    throw error;
  }
};