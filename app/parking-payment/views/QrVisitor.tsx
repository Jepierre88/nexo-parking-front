import { DateInput } from "@nextui-org/date-input";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";

export default function VisitanteQr() {
	return (
		<article className="flex flex-col gap-4">
			<h2 className="font-bold text-4xl text-center">
				Datos de visitante (QR)
			</h2>
			<form className="flex flex-col gap-3">
				<div className="flex gap-4 justify-between px-4">
					<label className="text-xl font-bold text-nowrap my-auto">
						Tipo de visitante (QR)
					</label>
					<Select
						className="w-1/2"
						size="sm"
						label="Seleccione el tipo de visitante"
					>
						<SelectItem key={"Visitor"}>Visitante (QR)</SelectItem>
					</Select>
				</div>
				<div className="flex gap-4 justify-between px-4">
					<label className="text-xl font-bold text-nowrap my-auto">QR</label>
					<Input variant="underlined" className="w-1/2" />
				</div>
				<div className="flex gap-4 justify-between px-4">
					<label className="text-xl font-bold text-nowrap my-auto">Placa</label>
					<Input variant="underlined" className="w-1/2" />
				</div>
				<div className="flex gap-4 justify-between px-4">
					<label className="text-xl font-bold text-nowrap my-auto">
						Fecha de entrada
					</label>
					<Input variant="underlined" className="w-1/2" />
				</div>
				<div className="flex gap-4 justify-between px-4">
					<label className="text-xl font-bold text-nowrap my-auto">
						Pago hasta
					</label>
					<DateInput variant="underlined" className="w-1/2" />
				</div>
			</form>
		</article>
	);
}
