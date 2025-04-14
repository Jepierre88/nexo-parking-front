
"use client";
import { UseTransactions } from "@/app/hooks/transactions/Usetransactions";
import TransactionsClient from "./TransactionsClient";
import { useSearchParams } from "next/navigation";

export default function TransactionsPage({
}: {
  }) {

  return <TransactionsClient />;
}
