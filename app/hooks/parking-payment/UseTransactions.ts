import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { CONSTANTS } from '@/config/constants';

export const useTransactions = () => {
  const getTransactions = async ({ from, to, page }: { from?: string; to?: string; page?: string }) => {
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

      const transactions = await axios.get(
        `${CONSTANTS.APIURL}/transactionPaymentPoint`,
        {
          headers: {
            "Content-Type": "application/json",
            ...searchParams,
            Authorization: `Bearer ${token}`,
          },
        },
      )

      return {
        transactions: transactions.data.data,
        meta: transactions.data.meta
      };
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  };

  const generateReport = async ({ from, to }: { from?: string; to?: string }): Promise<any[]> => {
    try {
      const response = await axios.get(
        `${CONSTANTS.APIURL}/generate-transactions-report`,
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
    getTransactions,
    generateReport
  };
};