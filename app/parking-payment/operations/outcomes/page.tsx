// 'use server' para indicar que estamos usando server-side rendering
'use server'
import { getOutcomesAction } from "@/actions/outcomes";
// import { getOutcomesAction } from "@/actions/outcomes"; // Asegúrate de tener esta función para obtener las salidas
import OutcomesClient from "./OutcomesClient";

export default async function OutcomesPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; plate?: string; page?: string }>;
}) {
  const { from, to, plate, page } = await searchParams;

  // Llamar a la acción para obtener las salidas con los parámetros recibidos
  // const outcomes = await getOutcomesAction({ from, to, plate, page });
  const outcomes = await getOutcomesAction({ from, to, plate, page });

  // Pasar los datos obtenidos al cliente
  return <OutcomesClient outcomes={outcomes} />;
}
