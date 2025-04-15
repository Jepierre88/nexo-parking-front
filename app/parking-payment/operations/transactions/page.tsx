
"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { UseTransactions } from "@/app/hooks/transactions/Usetransactions";
import TransactionsClient from "./TransactionsClient";

export default function TransactionsPage() {
  const searchParams = useSearchParams();
  const { getTransactionsAction } = UseTransactions();
  const [transactionData, setTransactionData] = useState({ transactions: [], pages: 1 });

  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const page = searchParams.get("page") || "1";
  const plate = searchParams.get("plate") || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getTransactionsAction({ from, to, page, plate });
        console.log(result.meta.lastPage);
        setTransactionData({ transactions: result.transactions, pages: result.meta.lastPage });
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchData();
  }, [from, to, page, plate]);

  return <TransactionsClient
    transactions={transactionData.transactions}
    pages={transactionData.pages}
  // pages={2}
  />;
}
