import axios from "axios";
import { useEffect, useState } from "react";

import Transaction from "@/types/Transaction";

export const UseTransactions = () => {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [loading, setLoading] = useState(true);

	const getTransactions = async (datetime?: Date, plate?: string) => {
		const dateWeek = new Date();

		dateWeek.setDate(dateWeek.getDate() - 1);

		try {
			setLoading(true);
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_LOCAL_APIURL}/transactionPaymentPoint`,
				{
					params: {
						startDateTime: datetime?.toISOString() || dateWeek.toISOString(),
						endDateTime: new Date().toISOString(),
						plate: plate,
					},
				}
			);

			setTransactions(response.data);
		} catch (error) {
			console.error("Error fetching transactions:", error);
		} finally {
			setLoading(false);
		}
	};

	const getTransactionForPrint = async (id: number) => {
		try {
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_LOCAL_APIURL}/printForId/${id}`
			);
			
			return response.data;
		} catch (error) {
			return null;
		} finally {
		}
	};

	useEffect(() => {
		getTransactions();
		return () => {};
	}, []);

	return {
		transactions,
		loading,
		getTransactions,
		getTransactionForPrint,
	};
};
