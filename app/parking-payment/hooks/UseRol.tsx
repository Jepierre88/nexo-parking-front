import axios from "axios";
import { useEffect, useState } from "react";
import { boolean } from "zod";

export default function UseRol(id: number, name: string, eliminated: boolean) {
  const [UseRol, setUseRol] = useState<any[]>([]);
  const getRol = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_LOCAL_APIURL}/rol`,
        {
          params: {
            id: id,
            name: name,
            eliminated: boolean,
          },
        }
      );
      setUseRol(response.data);
    } catch (error) {
      console.error(error);
    }
    useEffect(() => {
      getRol();
    }, []);
  };
  return {
    setUseRol,
    id,
    name,
    eliminated,
  };
}
