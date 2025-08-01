'use server'
import { getIncomesAction } from "@/actions/incomes";
import { parse } from "url";
import IncomesClient from "./IncomesClient";

export default async function IncomesPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; plate?: string, page?: string }>;
}) {
  const { from, to, plate, page } = await searchParams;
  const { incomes, meta: { lastPage } } = await getIncomesAction({ from, to, plate, page });

  return <IncomesClient incomes={incomes} pages={lastPage} />;
}
