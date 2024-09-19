import { DateInput } from "@nextui-org/date-input";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";

export default function QrPerdido() {
	return (
		<article className="flex flex-col gap-4">
			<h2 className="font-bold text-4xl text-center">Datos de QR perdido</h2>
			<form className="flex flex-col gap-3">
				<div className="flex gap-4 justify-between px-4">
					<label className="text-xl font-bold text-nowrap my-auto">Placa</label>
					<Input variant="underlined" className="w-1/2" />
				</div>
			</form>
		</article>
	);
}
