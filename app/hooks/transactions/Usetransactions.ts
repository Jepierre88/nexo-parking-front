'use client'
import axios from "axios";
import { useEffect, useState } from "react";

import Transaction from "@/types/Transaction";
import { CONSTANTS } from "@/config/constants";
import Factura from "@/types/Invoice";
import Cookies from "js-cookie";

export const UseTransactions = () => {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [loading, setLoading] = useState(true);

	// const getTransactions = async (datetime?: Date, plate?: string) => {
	// 	const dateWeek = new Date();

	// 	dateWeek.setDate(dateWeek.getDate() - 1);

	// 	try {
	// 		setLoading(true);
	// 		const response = await axios.get(
	// 			`${CONSTANTS.APIURL}/transactionPaymentPoint`,
	// 			{
	// 				params: {
	// 					startDateTime: datetime?.toISOString() || dateWeek.toISOString(),
	// 					endDateTime: new Date().toISOString(),
	// 					plate: plate,
	// 				},
	// 			}
	// 		);

	// 		setTransactions(response.data);
	// 	} catch (error) {
	// 		console.error("Error fetching transactions:", error);
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };

	async function getTransactionsAction({
		from,
		to,
		plate,
		page,
	}: {
		from?: string;
		to?: string;
		plate?: string;
		page?: string;
	}) {


		try {
			console.log("Fetching transactions")
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
				plate: plate ?? undefined,
				page: page ?? undefined,
			}
			console.log("searchParams", searchParams);
			console.log("token", Cookies.get("auth_token")); // Agrega esta línea para verificar los dat
			console.log("url", `${CONSTANTS.APIURL}/transactionPaymentPoint`); // Agrega esta línea para verificar los dato
			const transactions = await axios.get(
				`${CONSTANTS.APIURL}/transactionPaymentPoint`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						...searchParams,
						Authorization: `Bearer ${Cookies.get("auth_token")}`,
					}
				},
			)

			console.log("transactions", transactions.data)


			return { transactions: transactions.data.data, meta: transactions.data.meta }
		} catch (error) {
			console.error("Error fetching transactions:", error);
			throw error;
		}
	}

	const generateReport = async ({
		from, to
	}: {
		from?: string;
		to?: string;
	}): Promise<any[]> => {
		try {
			const response = await axios.get(
				//TODO Cambiar endpoint
				`${CONSTANTS.APIURL}/generate-report`,
				{
					params: {
						startDateTime: from,
						endDateTime: to,
					},
				}
			);

			const data: any[] = response.data;
			return data
		} catch (error) {
			console.error("Error al generar el reporte:", error);
			throw error;
		}
	}

	const getTransactionForPrint = async (id: number): Promise<Factura | null> => {
		try {
			console.log("id", id); // Agrega esta línea para verificar los dat
			const response = await axios.get(
				`${CONSTANTS.APIURL}/printForId`, {
				headers: {
					id,
					Authorization: `Bearer ${Cookies.get("auth_token")}`,
				}
			}
			);

			console.log("response", response.data); // Agrega esta línea para verificar los dato

			return response.data;
		} catch (error) {
			console.error("Error fetching transactions:", error);
			throw error;
			return null;
		} finally {
		}
	};

	// useEffect(() => {
	// 	getTransactions();
	// 	return () => { };
	// }, []);

	return {
		getTransactionsAction,
		transactions,
		loading,
		generateReport,
		getTransactionForPrint,
	};
};
