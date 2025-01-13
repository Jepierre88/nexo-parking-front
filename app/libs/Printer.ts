// Printer.js
import axios from "axios";

import Invoice from "@/types/Invoice";
import Income from "@/types/Income";
const DEFAULT_PLUGIN_URL = "http://localhost:8080";

class Operation {
	accion: string;
	datos: any;
	constructor(accion: string, datos: any) {
		this.accion = accion;
		this.datos = datos;
	}
}

export class Connector {
	nombre_impresora: string;
	operaciones: Operation[];
	constructor(nombre_impresora: string) {
		this.nombre_impresora = nombre_impresora;
		this.operaciones = [];
	}

	agregarOperacion(accion: string, datos: string) {
		const operacion = new Operation(accion, datos);

		this.operaciones.push(operacion);
	}

	async imprimir() {
		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_PRINTER_APIURL}/imprimir`,
				{
					nombre_impresora: this.nombre_impresora,
					operaciones: [...this.operaciones, { accion: "cut", datos: "" }],
				}
			);
		} catch (error) {
			console.log("Error al imprimir", error);
		}
	}

	async imprimirFacturaTransaccion(factura: Invoice) {
		// Encabezado de la factura
		this.operaciones.push({ accion: "textalign", datos: "center" });
		this.operaciones.push({ accion: "text", datos: factura.empresa });
		this.operaciones.push({ accion: "text", datos: `NIT: ${factura.nit}` });
		this.operaciones.push({ accion: "text", datos: factura.direccion });
		this.operaciones.push({
			accion: "text",
			datos: "---------------------------",
		});

		// Información del encabezado
		this.operaciones.push({ 
			accion: "textalign", 
			datos: "left" 
		});
		this.operaciones.push({ 
			accion: "bold", 
			datos: "on" 
		});
		this.operaciones.push({
			accion: "text",
			datos: `FACTURA ELECTRONICA DE VENTA: ${factura.header.FACTURA_ELECTRONICA_DE_VENTA.toString()}`,
		});
		this.operaciones.push({ accion: "bold", datos: "off" });

		this.operaciones.push({
			accion: "text",
			datos: `FECHA DE VENTA: ${factura.header.FECHA_DE_VENTA}`,
		});

		this.operaciones.push({
			accion: "text",
			datos: `REGIMEN: ${factura.header.REGIMEN}`,
		});

		this.operaciones.push({
			accion: "text",
			datos: `Cliente: ${factura.header.CLIENTE}`,
		});
		this.operaciones.push({
			accion: "text",
			datos: `CC/NIT: ${factura.header.NIT}`,
		});
		this.operaciones.push({
			accion: "text",
			datos: `FORMA DE PAGO: ${factura.header.FORMA_DE_PAGO}`,
		});
		this.operaciones.push({
			accion: "text",
			datos: `MEDIO DE PAGO: ${factura.header.MEDIO_DE_PAGO}`,
		});
		this.operaciones.push({
			accion: "text",
			datos: `PLACA: ${factura.header.PLACA}`,
		});
		this.operaciones.push({
			accion: "text",
			datos: `FECHA DE INGRESO: ${factura.header.FECHA_DE_INGRESO}`,
		});
		this.operaciones.push({
			accion: "text",
			datos: `DURACION: ${factura.header.DURACION}`,
		});
		this.operaciones.push({
			accion: "text",
			datos: `PUNTO DE PAGO: ${factura.header.PUNTO_DE_PAGO}`,
		});
		// Detalle de la factura
		this.operaciones.push({ accion: "textalign", datos: "center" });

		this.operaciones.push({
			accion: "text",
			datos: "---------------------------",
		});

		let auxDesc: any[] = [];

		factura.description.forEach((element) => {
			auxDesc.push({
				description: element.DESCRIPCION,
				price: element.VALOR,
				quantity: element.CANTIDAD,
			});
		});
		this.operaciones.push({
			accion: "table",
			datos: JSON.stringify(auxDesc),
		});
		this.operaciones.push({
			accion: "text",
			datos: "---------------------------",
		});

		// CUFE y resolución
		if (factura.infoCufe.CUFE) {
			const urlDian = `https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=${factura.infoCufe.CUFE}`;

			this.operaciones.push({ accion: "qr", datos: urlDian });
		}
		this.operaciones.push({
			accion: "text",
			datos: `CUFE: ${factura.infoCufe.CUFE ? factura.infoCufe.CUFE : "no disponible"}`,
		});
		this.operaciones.push({
			accion: "text",
			datos: "\n",
		});

		this.operaciones.push({ accion: "text", datos: factura.infoResolution });
		this.operaciones.push({
			accion: "text",
			datos: `FABRICANTE DE SOFTWARE: ${factura.infoSoftwareManufacturer}`,
		});
		this.operaciones.push({ accion: "text", datos: "\n" });
		this.operaciones.push({
			accion: "text",
			datos: `PROVEEDOR TECNOLOGICO: ${factura.infoTechnologyProvider}`,
		});
		this.operaciones.push({ accion: "text", datos: "\n" });
		this.operaciones.push({ accion: "text", datos: factura.infoPolice });

		// Corte de papel
		// Llamar al backend
		this.imprimir();
	}
	async imprimirIngreso(ingreso: Income) {
		const fechaIngreso = new Date(ingreso.datetime);
		//Encabezado
		this.operaciones.push({
			accion: "textalign",
			datos: "center",
		});
		this.operaciones.push({
			accion: "text",
			datos: `Fecha de ingreso: ${fechaIngreso.toLocaleString()}`,
		});
		this.operaciones.push({
			accion: "text",
			datos: `Tipo de vehiculo: ${ingreso.vehicleKind}`,
		});
		this.operaciones.push({
			accion: "text",
			datos: `Placa: ${ingreso.plate}`,
		});
		//QR
		this.operaciones.push({
			accion: `qr`,
			datos: `${ingreso.identificationId}`,
		});
		await this.imprimir();
	}
}
