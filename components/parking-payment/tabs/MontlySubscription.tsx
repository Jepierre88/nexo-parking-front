import { DateInput } from "@nextui-org/date-input";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";

export default function Mensualidad() {
	return (
		<article className="flex flex-col gap-2 justify-center h-full">
			<h2 className="font-bold text-2xl text-center">Datos de mensualidad</h2>

			<form className="flex flex-col gap-1">
				<div className="flex gap-4 justify-between px-4">
					<label className="text-base font-bold my-auto md:text-nowrap">
						Tipo de mensualidad
					</label>
					<Select className="w-1/2" label=" " size="sm">
						<SelectItem key={"Diurna"}>Mensualidad diurna</SelectItem>
						<SelectItem key={"Nocturna"}>Mensualidad nocturna</SelectItem>
					</Select>
				</div>
				<div className="flex gap-4 justify-between px-4 ">
					<div className="flex gap-4 justify-between ">
						<label className="text-base font-bold my-auto md:text-nowrap">
							N° de meses
						</label>
						<Input className="w-1/2" type="number" variant="underlined" />
					</div>
					<div className="flex gap-4 justify-between  ">
						<label className="text-base font-bold my-auto md:text-nowrap">
							Cedula
						</label>
						<Input className="w-1/2" variant="underlined" />
					</div>
				</div>
				<div className="flex gap-4 justify-between px-4 ">
					<label className="text-base font-bold text-nowrap my-auto">
						1° Nombre
					</label>
					<Input className="w-1/2" variant="underlined" />
					<label className="text-base font-bold text-nowrap my-auto">
						2° Nombre
					</label>
					<Input className="w-1/2" variant="underlined" />
				</div>
				<div className="flex gap-4 justify-between px-4">
					<label className="text-base font-bold text-nowrap my-auto">
						1° Apellido
					</label>
					<Input className="w-1/2" variant="underlined" />
					<label className="text-base font-bold text-nowrap my-auto">
						2° Apellido
					</label>
					<Input className="w-1/2" variant="underlined" />
				</div>
				<div className="flex gap-4 justify-between px-4">
					<label className="text-base font-bold text-nowrap my-auto">
						Placa
					</label>
					<Input className="w-1/2 uppercase" variant="underlined" />
				</div>
				<div className="flex gap-4 justify-between px-4">
					<label className="text-base font-bold text-nowrap my-auto">
						Válido hasta
					</label>
					<DateInput className="w-1/2" variant="underlined" />
				</div>
				<h2 className="font-bold text-2xl text-center">Última mensualidad</h2>
				<div className="flex gap-4 justify-between px-4 ">
					<div className="flex gap-4 justify-between px-4">
						<label className="text-base font-bold text-nowrap my-auto">
							Tipo
						</label>
					</div>
					<div className="flex gap-4 justify-between px-4">
						<label className="text-base font-bold text-nowrap my-auto">
							Valido hasta
						</label>
					</div>
				</div>
			</form>
		</article>
	);
}
