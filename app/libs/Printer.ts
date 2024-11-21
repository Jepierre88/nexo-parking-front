// Printer.js
import axios from "axios";

import { Factura } from "@/types";
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
        },
      );
    } catch (error) {
      console.log("Error al imprimir", error);
    }
  }

  async imprimirFacturaTransaccion(factura: Factura) {
    const operaciones: Array<{ accion: string; datos: string }> = [];

    // Encabezado de la factura
    operaciones.push({ accion: "textalign", datos: "center" });
    operaciones.push({ accion: "text", datos: factura.empresa });
    operaciones.push({ accion: "text", datos: `NIT: ${factura.nit}` });
    operaciones.push({ accion: "text", datos: factura.direccion });
    operaciones.push({ accion: "text", datos: "---------------------------" });

    // Información del encabezado
    operaciones.push({ accion: "textalign", datos: "left" });
    operaciones.push({ accion: "bold", datos: "on" });
    operaciones.push({
      accion: "text",
      datos: `FACTURA ELECTRONICA DE VENTA: ${factura.header.FACTURA_ELECTRONICA_DE_VENTA.toString()}`,
    });
    operaciones.push({ accion: "bold", datos: "off" });

    operaciones.push({
      accion: "text",
      datos: `FECHA DE VENTA: ${factura.header.FECHA_DE_VENTA}`,
    });

    operaciones.push({
      accion: "text",
      datos: `REGIMEN: ${factura.header.REGIMEN}`,
    });

    operaciones.push({
      accion: "text",
      datos: `Cliente: ${factura.header.CLIENTE}`,
    });
    operaciones.push({
      accion: "text",
      datos: `CC/NIT: ${factura.header.NIT}`,
    });
    //FORMA DE PAGO
    operaciones.push({
      accion: "text",
      datos: `FORMA DE PAGO: ${factura.header.FORMA_DE_PAGO}`,
    });
    operaciones.push({
      accion: "text",
      datos: `MEDIO DE PAGO: ${factura.header.MEDIO_DE_PAGO}`,
    });
    operaciones.push({
      accion: "text",
      datos: `PLACA: ${factura.header.PLACA}`,
    });
    operaciones.push({
      accion: "text",
      datos: `FECHA DE INGRESO: ${factura.header.FECHA_DE_INGRESO}`,
    });
    operaciones.push({
      accion: "text",
      datos: `DURACION: ${factura.header.DURACION}`,
    });
    operaciones.push({
      accion: "text",
      datos: `PUNTO DE PAGO: ${factura.header.PUNTO_DE_PAGO}`,
    });
    // Detalle de la factura
    operaciones.push({ accion: "textalign", datos: "center" });

    operaciones.push({ accion: "text", datos: "---------------------------" });

    let auxDesc: any[] = [];

    factura.description.forEach((element) => {
      auxDesc.push({
        description: element.DESCRIPCION,
        price: element.VALOR,
        quantity: element.CANTIDAD,
      });
    });
    operaciones.push({
      accion: "table",
      datos: JSON.stringify(auxDesc),
    });
    operaciones.push({ accion: "text", datos: "---------------------------" });

    // CUFE y resolución
    if (factura.infoCufe.CUFE) {
      const urlDian = `https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=${factura.infoCufe.CUFE}`;

      operaciones.push({ accion: "qr", datos: urlDian });
    }
    operaciones.push({ accion: "text", datos: factura.infoResolution });
    operaciones.push({
      accion: "text",
      datos: factura.infoSoftwareManufacturer,
    });
    operaciones.push({ accion: "text", datos: "\n" });
    operaciones.push({ accion: "text", datos: factura.infoTechnologyProvider });
    operaciones.push({ accion: "text", datos: "\n" });
    operaciones.push({ accion: "text", datos: factura.infoPolice });

    // Corte de papel
    operaciones.push({ accion: "cut", datos: "" });

    // Llamar al backend
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PRINTER_APIURL}/imprimir`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre_impresora: this.nombre_impresora, // Cambiar por la impresora que corresponda
            operaciones,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Error al imprimir la factura");
      }
    } catch (error) {
      console.error("Error al enviar los datos de impresión:", error);
    }
  }
}
