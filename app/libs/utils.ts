import * as XLSX from "xlsx";
export const printInvoice = () => {
	const printWindow = window.open("", "", "height=600,width=800");

	if (!printWindow) {
		return;
	}

	// Crear el contenido imprimible
	printWindow.document.write("<html><head><title>Factura</title><style>");
	printWindow.document.write(
		"body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }"
	);
	printWindow.document.write(
		".invoice-container { width: 100%; max-width: 600px; margin: auto; background-color: #f8f8f8; padding: 20px; }"
	);
	printWindow.document.write(".header { text-align: center; }");
	printWindow.document.write(
		"#cufe { word-wrap: break-word; overflow-wrap: break-word; white-space: normal; }"
	);
	printWindow.document.write("@media print {");
	printWindow.document.write("body { margin: 0; padding: 0; }");
	printWindow.document.write("#print-content { margin: 0; padding: 0; }");
	printWindow.document.write("}");
	printWindow.document.write(".section { margin-top: 20px; }");
	printWindow.document.write("table { width: 100%; }");
	printWindow.document.write(
		"th, td { text-align: left; padding: 8px; font-size:12px;}"
	);
	printWindow.document.write(
		"#payment-container { text-align: right; margin-top: 20px; }"
	);
	printWindow.document.write(
		"#dian-container { text-align: center; margin: 5px 0px 5px 0px; }"
	);
	printWindow.document.write(
		"p{margin:0; padding: 1px; font-size: 12px; font-weight: normal;}"
	);
	printWindow.document.write(
		'#cufe-container { width: 40%; /* O un valor específico que se adapte */ white-space: wrap; /* Evita que el texto se divida en varias líneas */ overflow: hidden; /* Oculta cualquier texto que se desborde */ text-overflow: ellipsis; /* Muestra "..." si el texto es demasiado largo */ }'
	);
	printWindow.document.write(
		".footer { text-align: center; margin-top: 20px; font-size: 12px; }"
	);
	printWindow.document.write("hr { border: 1px solid black; margin: 20px 0; }");
	printWindow.document.write("</style></head><body>");
	printWindow.document.write('<div id="print-content">');
	printWindow.document.write("<h1>Holaaaaaaaaaaaaaaaaaaa</h1>");

	// Asegúrate de reemplazar los datos con los valores correctos

	printWindow.document.write("</div>");
	printWindow.document.write("</body></html>");
	printWindow.document.close();

	// Llamar a la impresión solo después de que el QR se haya cargado
	printWindow.document.close();
	printWindow.focus();
	printWindow.print();

	// Manejar errores de carga de la imagen QR
};

export function createEmptyObject<T>(): T {
	return {} as T; // Esto devuelve un objeto vacío sin inicializar propiedades
}

export const formatDate = (date: Date | null | undefined) => {
	if (!date || isNaN(date.getTime())) {
		return "";
	}
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");
	const seconds = String(date.getSeconds()).padStart(2, "0");

	return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
};


export const exportToExcel = <T>(data: T[], fileName: string) => {

	const worksheet = XLSX.utils.json_to_sheet(data);
	const workbook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
	XLSX.writeFile(workbook, `${fileName}.xlsx`);

}

//THIS FUNCTION IS USED TO UPDATE THE PAYMENT DATA AFTER VALIDATING THE PLATE

export const updatePaymentData = (data: any, fn: Function) => {
	const updatedExtraServices =
		data.extraServices?.map((service: any) => ({
			code: service.code,
			name: service.name,
			quantity: service.quantity || 1,
			unitPrice: service.unitPrice,
			totalPrice: service.totalPrice,
			iva: service.iva,
			ivaAmount: service.ivaAmount,
			netTotal: service.netTotal,
			isLocked: true,
		})) || [];

	const recalculatedTotals = updatedExtraServices.reduce(
		(acc: any, service: any) => {
			acc.netTotalServices += service.netTotal;
			acc.totalServices += service.totalPrice;
			acc.totalIVA += service.ivaAmount;
			return acc;
		},
		{ netTotalServices: 0, totalServices: 0, totalIVA: 0 }
	);

	const totalParking = data.total || 0;
	const totalCost = recalculatedTotals.totalServices + totalParking;

	fn({
		...data,
		plate: data.plate,
		extraServices: updatedExtraServices,
		netTotalServices: recalculatedTotals.netTotalServices,
		totalServices: recalculatedTotals.totalServices,
		totalParking,
		totalCost,
	});
}


export const clasifyPlate = (plate: string) => {
	const normalized = plate.toUpperCase().trim();

	// Carros: 3 letras + 3 números
	const carRegex = /^[A-Z]{3}\d{3}$/;

	// Motos: 3 letras + 2 números
	const motoRegex1 = /^[A-Z]{3}\d{2}$/;

	// Motos: 3 letras + 2 números + 1 letra
	const motoRegex2 = /^[A-Z]{3}\d{2}[A-Z]$/;

	if (carRegex.test(normalized)) return "CARRO";
	if (motoRegex1.test(normalized) || motoRegex2.test(normalized)) return "MOTO";

	return "UNKNOWN";
};
