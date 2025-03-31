import axios from "axios";
import { useState } from "react";

import { Email } from "@/types";
import { CONSTANTS } from "@/config/constants";

export default function UseResetPassword() {
  const [loading, setLoading] = useState(false);

  const resetPassword = async (email: Email) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${CONSTANTS.APIURL}/reset-password/init`,
        {
          email: email,
        }
      );

      console.log(
        "Solicitud de restablecimiento de contraseña enviada:",
        response.data
      );

      return response.data;
    } catch (error) {
      console.error(
        "Error al enviar la solicitud de restablecimiento de contraseña:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  return { resetPassword, loading };
}
