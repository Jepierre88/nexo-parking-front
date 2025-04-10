import { Encabezado } from './../../types/Closure';

// Printer.js
import axios from "axios";

import Invoice from "@/types/Invoice";
import Income from "@/types/Income";
import { Closure, Transaction, ClosureDetails } from "@/types/Closure";
import Cookies from "js-cookie";
import { ConstructionOutlined } from '@mui/icons-material';

const getDeviceName = () => {
	const userCookie = Cookies.get("user");
	if (userCookie) {
		const userData = JSON.parse(userCookie);
		return userData.deviceNme || "Dispositivo desconocido";
	}
	return "Dispositivo desconocido";
};

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

	imprimir(): Promise<any> {
		return new Promise((resolve, reject) => {
			axios
				.post(`${process.env.NEXT_PUBLIC_PRINTER_APIURL}/imprimir`, {
					nombre_impresora: this.nombre_impresora,
					operaciones: [...this.operaciones, { accion: "cut", datos: "" }],
				})
				.then((response) => {
					resolve(response); // Resuelve la promesa si la petición es exitosa
				})
				.catch((error) => {
					console.log("Error al imprimir", error);
					reject(error); // Rechaza la promesa en caso de error
				});
		});
	}


	async imprimirFacturaTransaccion(factura: Invoice): Promise<void> {
		const addPadding = (text: string, totalWidth: number, padding: number = 2) => {
			const spaces = " ".repeat(padding);
			const contentWidth = totalWidth - 2 * padding;
			const truncatedText = text.slice(0, contentWidth);
			return `${spaces}${truncatedText}${spaces}`;
		};


		const totalWidth = 40;
		const padding = 4;
		this.operaciones.push({
			accion: "text",
			datos: "\n",
		});
		// Encabezado de la factura
		this.operaciones.push({ accion: "textalign", datos: "center" });
		this.operaciones.push({ accion: "text", datos: factura.empresa });
		this.operaciones.push({ accion: "text", datos: `NIT: ${factura.nit}` });
		this.operaciones.push({ accion: "text", datos: factura.direccion });
		this.operaciones.push({
			accion: "text",
			datos: addPadding("----------------------------------------", totalWidth, padding)
		});
		this.operaciones.push({
			accion: "text",
			datos: "\n",
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
		// FORMA DE PAGO
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
			datos: "----------------------------------------",
		});
		this.operaciones.push({
			accion: "text",
			datos: "\n",
		});

		let auxDesc: any[] = [];

		factura.description.forEach((element) => {
			auxDesc.push({
				description: ` ${element.DESCRIPCION}`,
				price: element.VALOR,
				quantity: element.CANTIDAD,
			});
		});


		this.operaciones.push({
			accion: "table",
			datos: JSON.stringify(auxDesc),
		});



		factura.descriptionTotal.forEach((totalData) => {
			const createAlignedText = (
				label: string,
				value: any,
				totalWidth: number,
				maxLabelWidth: number
			) => {
				const valueString = value.toString();

				// Asegura que todos los labels tengan la misma longitud para alinear los ':'
				const paddedLabel = label.padEnd(maxLabelWidth, " ");

				// Calcula el espacio restante para centrar el texto completo (label + value)
				const text = `${paddedLabel}${valueString}`;
				const leftPadding = Math.max(0, Math.floor((totalWidth - text.length) / 2));
				const spacesLeft = " ".repeat(leftPadding);

				return `${spacesLeft}${text}`;
			};

			const lineWidth = 40;
			const colonPosition = 20;

			this.operaciones.push({
				accion: "text",
				datos: "\n\n",
			});

			this.operaciones.push({
				accion: "text",
				datos: createAlignedText("Cantidad Total:", totalData.CANTIDAD_TOTAL || 0, lineWidth, colonPosition),
			});
			this.operaciones.push({
				accion: "text",
				datos: createAlignedText("Base:", totalData.BASE || 0, lineWidth, colonPosition)
			});
			this.operaciones.push({
				accion: "text",
				datos: createAlignedText("Descuento:", totalData.DESCUENTO || 0, lineWidth, colonPosition)
			});
			this.operaciones.push({
				accion: "text",
				datos: createAlignedText("Subtotal:", totalData.SUBTOTAL || 0, lineWidth, colonPosition)
			});
			this.operaciones.push({
				accion: "text",
				datos: createAlignedText("IVA 19%:", totalData.IVA_19 || 0, lineWidth, colonPosition)
			});
			this.operaciones.push({
				accion: "text",
				datos: createAlignedText("Total:", totalData.TOTAL || 0, lineWidth, colonPosition)
			});
			this.operaciones.push({
				accion: "text",
				datos: createAlignedText("Recibido: ", totalData.RECIBIDO || 0, lineWidth, colonPosition)
			});
			this.operaciones.push({
				accion: "text",
				datos: createAlignedText("Cambio:", totalData.CAMBIO || 0, lineWidth, colonPosition)
			});

			this.operaciones.push({
				accion: "text",
				datos: "----------------------------------------",
			});
		});
		this.operaciones.push({
			accion: "text",
			datos: "\n\n",
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
		this.operaciones.push({
			accion: "text",
			datos: "\n\n",
		});
		// Llamar al backend
		return this.imprimir(); // Devuelve la promesa generada por imprimir
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
			// datos: `https://pay.coins-colombia.com/validate-data?companyId=2&serviceId=1&companyCode=${ingreso.identificationId}`,
			datos: `${ingreso.identificationId}`,
		});
		await this.imprimir();
	}

	async imprimirCierre(cierre: [Encabezado, Transaction[], ClosureDetails]): Promise<void> {
		const encabezado = cierre[0];
		const transacciones = cierre[1];
		const detalles = cierre[2];

		const formatLeftRight = (leftText: string, rightText: string, width: number) => {
			const spaceAvailable = width - leftText.length - rightText.length;
			const spaces = " ".repeat(Math.max(spaceAvailable, 0));
			return `${leftText}${spaces}${rightText}`;
		};


		const wrapText = (text: string, maxWidth: number) => {
			const words = text.split(" ");
			let lines: string[] = [];
			let currentLine = "";

			for (const word of words) {
				if ((currentLine + word).length <= maxWidth) {
					currentLine += (currentLine ? " " : "") + word;
				} else {
					lines.push(currentLine);
					currentLine = word;
				}
			}
			if (currentLine) lines.push(currentLine);

			return lines;
		};


		const formatTableRow = (item: string, quantity: number, total: number, col1: number, col2: number, col3: number) => {
			const itemLines = wrapText(item, col1);
			let outputLines: string[] = [];

			itemLines.forEach((line, index) => {
				if (index === itemLines.length - 1) {
					const row = `${line.padEnd(col1)}${quantity.toString().padEnd(col2)}${total.toLocaleString().padStart(col3)}`;
					outputLines.push(row);
				} else {
					const row = `${line.padEnd(col1)} ${" ".repeat(col2)} ${" ".repeat(col3)}`;
					outputLines.push(row);
				}
			});
			return outputLines;
		};


		const lineWidth = 40;
		const col1Width = 20; // Item
		const col2Width = 10; // Cant
		const col3Width = 10; // Total

		const col1 = 20;
		const col2 = 8;
		const col3 = 10;

		const header = `${"Item".padEnd(col1Width)}${"Cant".padEnd(col2Width)}${"Total".padEnd(col3Width)}`;
		const fromDatetime = encabezado.fromDatetime ? new Date(encabezado.fromDatetime) : new Date();
		const toDatetime = encabezado.toDatetime ? new Date(encabezado.toDatetime) : new Date();
		const deviceName = getDeviceName();

		// 📌 Encabezado del ticket
		this.operaciones.push({ accion: "textalign", datos: "center" });
		this.operaciones.push({ accion: "text", datos: `Nit: ` });
		this.operaciones.push({ accion: "text", datos: `Dirección: ` });
		this.operaciones.push({ accion: "text", datos: `Cierre de Ventas` });
		this.operaciones.push({ accion: "text", datos: `------------------------------------------` });
		this.operaciones.push({ accion: "text", datos: `Máquina: ${deviceName}` });
		this.operaciones.push({ accion: "text", datos: `DESDE: ${fromDatetime.toLocaleString()}` });
		this.operaciones.push({ accion: "text", datos: `HASTA: ${toDatetime.toLocaleString()}` });
		this.operaciones.push({ accion: "text", datos: "\n", });

		transacciones.forEach((transaccion: Transaction) => {
			this.operaciones.push({ accion: "bold", datos: "on" });
			this.operaciones.push({ accion: "text", datos: `Transacciones ${transaccion.transactionType}` });
			this.operaciones.push({ accion: "bold", datos: "off" });

			// 📌 Insertar encabezado de columnas después del transactionType
			this.operaciones.push({ accion: "text", datos: "------------------------------------------" });
			this.operaciones.push({ accion: "bold", datos: "on" });
			this.operaciones.push({ accion: "text", datos: header });
			this.operaciones.push({ accion: "bold", datos: "off" });

			// 📌 Recorrer items dentro de cada transacción
			transaccion.items.forEach((item) => {
				const formattedRows = formatTableRow(item.code, item.cnt, item.total, col1, col2, col3Width);
				formattedRows.forEach((row) => {
					this.operaciones.push({ accion: "text", datos: row });
				});
			});


			// 📌 Total de cada tipo de transacción
			this.operaciones.push({ accion: "text", datos: "------------------------------------------" });
			this.operaciones.push({ accion: "text", datos: formatLeftRight("Total:", transaccion.total.toLocaleString(), lineWidth), });
			this.operaciones.push({ accion: "text", datos: "\n", });
		});


		// 📌 Monto recibido
		this.operaciones.push({ accion: "bold", datos: "on" });
		this.operaciones.push({ accion: "text", datos: "Dinero Recibido" });
		this.operaciones.push({ accion: "bold", datos: "off" });

		// 📌 Insertar encabezado de columnas después del dinero Recibido
		this.operaciones.push({ accion: "text", datos: "------------------------------------------" });
		this.operaciones.push({ accion: "bold", datos: "on" });
		this.operaciones.push({ accion: "text", datos: header });
		this.operaciones.push({ accion: "bold", datos: "off" });

		// 📌 Recorrer items dentro de cada transacción
		detalles.amountReceived.forEach((monto) => {
			const formattedRows = formatTableRow(monto.item, monto.cantidad, monto.total, col1, col2, col3);
			formattedRows.forEach((row) => {
				this.operaciones.push({ accion: "text", datos: row });
			});
		});
		this.operaciones.push({ accion: "text", datos: "------------------------------------------" });
		this.operaciones.push({ accion: "text", datos: formatLeftRight("Total:", detalles.totalAmountReceived.toLocaleString(), lineWidth), });
		this.operaciones.push({ accion: "text", datos: "\n", });
		// 📌 Monto devuelto
		this.operaciones.push({ accion: "bold", datos: "on" });
		this.operaciones.push({ accion: "text", datos: "Dinero Devolución" });
		this.operaciones.push({ accion: "bold", datos: "off" });

		// 📌 Insertar encabezado de columnas después del dinero Devuelto
		this.operaciones.push({ accion: "text", datos: "------------------------------------------" });
		this.operaciones.push({ accion: "bold", datos: "on" });
		this.operaciones.push({ accion: "text", datos: header });
		this.operaciones.push({ accion: "bold", datos: "off" });

		// 📌 Recorrer items dentro de cada transacción

		detalles.amountToReturn.forEach((devolucion) => {
			const formattedRows = formatTableRow(devolucion.item, devolucion.cantidad, devolucion.total, col1, col2, col3);
			formattedRows.forEach((row) => {
				this.operaciones.push({ accion: "text", datos: row });
			});
		});
		this.operaciones.push({ accion: "text", datos: "------------------------------------------" });
		this.operaciones.push({ accion: "text", datos: formatLeftRight("Total:", detalles.totalAmountToReturn.toLocaleString(), lineWidth), });
		this.operaciones.push({ accion: "text", datos: "\n", });

		// 📌 Sección de resumen de medios de pago
		this.operaciones.push({ accion: "bold", datos: "on" });
		this.operaciones.push({ accion: "text", datos: "Medio de Pago" });
		this.operaciones.push({ accion: "bold", datos: "off" });

		// 📌 Insertar encabezado de columnas después del medio de pago
		this.operaciones.push({ accion: "text", datos: "------------------------------------------" });
		this.operaciones.push({ accion: "bold", datos: "on" });
		this.operaciones.push({ accion: "text", datos: header });
		this.operaciones.push({ accion: "bold", datos: "off" });

		// 📌 Recorrer items dentro de cada transacción
		detalles.paymentMethods.forEach((metodo) => {
			const formattedRows = formatTableRow(metodo.item, metodo.cantidad, metodo.total, col1, col2, col3);
			formattedRows.forEach((row) => {
				this.operaciones.push({ accion: "text", datos: row });
			});
		});
		this.operaciones.push({ accion: "text", datos: "------------------------------------------" });
		this.operaciones.push({ accion: "text", datos: formatLeftRight("Total:", detalles.totalPaymentMethods.toLocaleString(), lineWidth), });
		this.operaciones.push({ accion: "text", datos: "\n", });



		await this.imprimir();
	}

}
