import { DateInput } from "@nextui-org/date-input";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";

export default function Mensualidad() {
	return (
		<article className="flex flex-col gap-4">
			<h2 className="font-bold text-4xl text-center">Datos de mensualidad</h2>
			<form className="flex flex-col gap-3">
				<div className="flex gap-4 justify-between px-4">
					<label className="text-xl font-bold my-auto md:text-nowrap">
						Tipo de transacción
					</label>
					<Select
						className="w-1/2"
						size="sm"
						label="Seleccione el tipo de mensualidad"
					>
						<SelectItem key={"Diurna"}>Mensualidad diurna</SelectItem>
						<SelectItem key={"Nocturna"}>Mensualidad nocturna</SelectItem>
					</Select>
				</div>
				<div className="flex gap-4 justify-between px-4">
					<label className="text-xl font-bold my-auto md:text-nowrap">
						Cantidad de mensualidad a pagar
					</label>
					<Input variant="underlined" type="number" className="my-auto"/>
				</div>
				<div className="flex gap-4 justify-between px-4">
					<label className="text-xl font-bold text-nowrap my-auto">
						Cedula
					</label>
					<Input variant="underlined" className="w-1/2" />
				</div>
				<div className="flex gap-4 justify-between px-4">
					<label className="text-xl font-bold text-nowrap my-auto">
						1° Nombre
					</label>
					<Input variant="underlined" className="w-1/2" />
					<label className="text-xl font-bold text-nowrap my-auto">
						2° Nombre
					</label>
					<Input variant="underlined" className="w-1/2" />
				</div>
				<div className="flex gap-4 justify-between px-4">
					<label className="text-xl font-bold text-nowrap my-auto">
						1° Apellido
					</label>
					<Input variant="underlined" className="w-1/2" />
					<label className="text-xl font-bold text-nowrap my-auto">
						2° Apellido
					</label>
					<Input variant="underlined" className="w-1/2" />
				</div>
				<div className="flex gap-4 justify-between px-4">
					<label className="text-xl font-bold text-nowrap my-auto">
						Placa
					</label>
					<Input variant="underlined" className="w-1/2 uppercase" />
				</div>
				<div className="flex gap-4 justify-between px-4">
					<label className="text-xl font-bold text-nowrap my-auto">
						Válido hasta
					</label>
					<DateInput variant="underlined" className="w-1/2" />
				</div>
				<h2 className="font-bold text-4xl text-center">Última mensualidad</h2>
				<div className="flex gap-4 justify-between px-4">
					<label className="text-xl font-bold text-nowrap my-auto">Tipo</label>
				</div>
				<div className="flex gap-4 justify-between px-4">
					<label className="text-xl font-bold text-nowrap my-auto">Valido hasta</label>
				</div>
	
			</form>
		</article>
	);
}
