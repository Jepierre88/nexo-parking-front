'use client';

import { CONSTANTS } from "@/config/constants";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

export const useClosures = () => {
  const getClosures = async ({ from, to, page }: { from?: string; to?: string; page?: string }) => {
    const token = Cookies.get('auth_token');

    try {
      let fromDate: Date;
      let toDate: Date;

      if (from && to) {
        fromDate = new Date(from);
        toDate = new Date(to);
      } else {
        // Set default range to current day
        const now = new Date();
        fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        toDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      }

      const searchParams = {
        startDateTime: fromDate.toISOString(),
        endDateTime: toDate.toISOString(),
        page: page ?? 1,
      }

      const closures = await axios.get(
        `${CONSTANTS.APIURL}/payment-closures`,
        {
          headers: {
            "Content-Type": "application/json",
            ...searchParams,
            Authorization: `Bearer ${token}`,
          },
        },
      )

      return {
        closures: closures.data.data,
        meta: closures.data.meta
      };
    } catch (error) {
      console.error("Error fetching closures:", error);
      throw error;
    }
  };

  const postClosure = async (cashier: string) => {
    const token = Cookies.get('auth_token');

    try {
      const response = await axios.post(
        `${CONSTANTS.APIURL}/generatePaymentClosure/${cashier}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) console.log(error.response?.data);
      console.error("Error al realizar el cierre:", error);
      throw error;
    }
  };

  const getClosureDetails = async (id: number) => {
    const token = Cookies.get('auth_token');

    try {
      const response = await axios.get(
        `${CONSTANTS.APIURL}/payment-closure/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const sendEmail = async (idClosure: number, email: string) => {
    const token = Cookies.get('auth_token');

    try {
      const response = await axios.post(
        `${CONSTANTS.APIURL}/sendEmailPaymentClosure/${idClosure}`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error al enviar el email:", error);
      throw error;
    }
  };

  const generateReport = async ({ from, to }: { from?: string; to?: string }): Promise<any[]> => {
    try {
      const response = await axios.get(
        `${CONSTANTS.APIURL}/generate-report`,
        {
          params: {
            startDateTime: from,
            endDateTime: to,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error al generar el reporte:", error);
      throw error;
    }
  };

  return {
    getClosures,
    postClosure,
    getClosureDetails,
    sendEmail,
    generateReport
  };
};