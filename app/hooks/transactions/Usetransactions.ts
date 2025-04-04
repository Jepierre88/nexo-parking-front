'use client'
import axios from "axios";
import { useEffect, useState } from "react";

import Transaction from "@/types/Transaction";
import { CONSTANTS } from "@/config/constants";
import Factura from "@/types/Invoice";

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

	const getTransactionForPrint = async (id: number): Promise<Factura | null> => {
		try {
			console.log("id", id); // Agrega esta línea para verificar los dat
			const response = await axios.get(
				`${CONSTANTS.APIURL}/printForId`, {
				headers: {
					id
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
		transactions,
		loading,
		getTransactionForPrint,
	};
};
