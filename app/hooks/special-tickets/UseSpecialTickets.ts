import { CONSTANTS } from "@/config/constants";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export default function useSpecialTickets() {
  const [specialTickets, setSpecialTickets] = useState<any[]>([])

  const getSpecialTickets = async () => {
    try {
      const response = await fetch(`${CONSTANTS.APIURL}/listSpecialTickets`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Cookies.get("auth_token")}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setSpecialTickets(data)
      } else {
        setSpecialTickets([])
      }
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  useEffect(() => {
    getSpecialTickets()
  }, [])

  return {
    specialTickets
  }

}