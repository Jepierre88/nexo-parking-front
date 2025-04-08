'use server'
import { getIncomesAction } from "@/actions/incomes";
import { parse } from "url";
import PaymentClosureClient from "./PaymentClosureClient";
import { getClosuresAction } from "@/actions/closures";

export default async function IncomesPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; page?: string }>;
}) {
  const { from, to, page } = await searchParams;

  const { closures, meta: {
    lastPage
  } } = await getClosuresAction({ from, to, page });
  return <PaymentClosureClient closures={closures} pages={lastPage} />;
}
