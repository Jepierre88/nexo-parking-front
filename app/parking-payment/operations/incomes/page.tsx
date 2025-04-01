'use server'
import { getIncomesAction } from "@/actions/incomes";
import { parse } from "url";
import IncomesClient from "./IncomesClient";

export default async function IncomesPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; plate?: string }>;
}) {
  const { from, to, plate } = await searchParams;
  const incomes = await getIncomesAction({ from, to, plate });

  return <IncomesClient initialIncomes={incomes} />;
}
