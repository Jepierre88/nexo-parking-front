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

export const formatDate = (date: Date) => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");
	const seconds = String(date.getSeconds()).padStart(2, "0");

	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
