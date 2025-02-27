
// Printer.js
import axios from "axios";

import Invoice from "@/types/Invoice";
import Income from "@/types/Income";
import Closure from '@/types/Closure';
import Cookies from "js-cookie";

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
			datos: addPadding("----------------------------------------",totalWidth, padding) 
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
              datos:  createAlignedText("Subtotal:", totalData.SUBTOTAL || 0, lineWidth, colonPosition)
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
              datos: createAlignedText("Cambio:",totalData.CAMBIO || 0, lineWidth, colonPosition)
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
			datos: `${ingreso.identificationId}`,
		});
		await this.imprimir();
	}

	async imprimirCierre(cierre: Closure): Promise<void> {
		const addPadding = (text: string, totalWidth: number, padding: number = 2) => {
			const spaces = " ".repeat(padding); 
			const contentWidth = totalWidth - 2 * padding; 
			const truncatedText = text.slice(0, contentWidth); 
			return `${spaces}${truncatedText}${spaces}`; 
		};
		const totalWidth = 40;
		const col1Width = 20; // Item
		const col2Width = 10; // Cant
		const col3Width = 10; // Total
		const header = `${"Item".padEnd(col1Width)}${"Cant".padEnd(col2Width)}${"Total".padEnd(col3Width)}`;

		const fromDatetime = new Date(cierre.fromDatetime);
		const toDatetime = new Date(cierre.toDatetime);

		const deviceNme = getDeviceName();
		//Encabezado
		this.operaciones.push({
			accion: "textalign",
			datos: "center",
		});
		this.operaciones.push({
			accion: "text",
			datos: 'Nit:',
		});
		this.operaciones.push({
			accion: "text",
			datos: 'Dirección:',
		});
		this.operaciones.push({
			accion: "text",
			datos: 'Cierre de ventas',
		});
		this.operaciones.push({
			accion: "text",
			datos: '------------------------------------------',
		});
		this.operaciones.push({
			accion: "text",
			datos: `Máquina: ${deviceNme}`,
		});
		this.operaciones.push({
			accion: "text",
			datos: `DESDE: ${fromDatetime.toLocaleString()}`,
		});

		this.operaciones.push({
			accion: "text",
			datos: `HASTA: ${toDatetime.toLocaleString()}`,
		});

	
		
		this.operaciones.push({
			accion: "text",
			datos: `------------------------------------------`,
		});
		this.operaciones.push({
			accion: "bold",
			datos: "on",
		});
		this.operaciones.push({
			accion: "text",
			datos: header,  
		});
		this.operaciones.push({
			accion: "bold",
			datos: "off",
		});
		await this.imprimir();
	}
}
