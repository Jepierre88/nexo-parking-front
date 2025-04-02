'use server'
import TransactionsClient from "./TransactionsClient";
import { getTransactionsAction } from "@/actions/transactions";

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; plate?: string; page?: string }>;
}) {
  const { from, to, plate, page } = await searchParams;

  // Llamar a la acción para obtener las transacciones con los parámetros recibidos

  const transactions = await getTransactionsAction({ from, to, plate, page });
  // const transactions: Transaction[] = []
  // Pasar los datos obtenidos al cliente
  return <TransactionsClient transactions={transactions} />;
}
