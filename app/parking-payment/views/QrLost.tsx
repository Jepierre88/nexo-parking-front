import { DateInput } from "@nextui-org/date-input";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";

export default function QrPerdido() {
	return (
		<section className="flex flex-col md:flex-row gap-3 justify-center items-center">
			<article className="md:w-[600px] w-full py-2">
				
				<h2 className="font-bold text-2xl text-center">
					Datos de QR perdido
				</h2>
				
			<form className="flex flex-col gap-3">
				<div className="flex gap-4 justify-between px-4">
					<label className="text-xl font-bold text-nowrap my-auto">Placa</label>
					<Input variant="underlined" className="w-1/2" />
				</div>
			</form>
			</article>
		</section>
	);
}