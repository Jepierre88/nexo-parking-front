import axios from "axios";
import { useState } from "react";

import { Email } from "@/types";

export default function UseResetPassword() {
  const [loading, setLoading] = useState(false);

  const resetPassword = async (email: Email) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_LOCAL_APIURL}/reset-password/init`,
        {
          email: email,
        },
      );

      console.log(
        "Solicitud de restablecimiento de contraseña enviada:",
        response.data,
      );

      return response.data;
    } catch (error) {
      console.error(
        "Error al enviar la solicitud de restablecimiento de contraseña:",
        error,
      );
    } finally {
      setLoading(false);
    }
  };

  return { resetPassword, loading };
}
