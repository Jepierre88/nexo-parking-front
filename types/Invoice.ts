export default interface Factura {
	description: Description[];
	direccion: string;
	empresa: string;
	header: Header;
	infoCufe: InfoCufe;
	infoPolice: string;
	infoResolution: string;
	infoSoftwareManufacturer: string;
	infoTechnologyProvider: string;
	nit: string;
}

interface Description {
	BASE: number;
	CAMBIO: number;
	CANTIDAD: number;
	CANTIDAD_TOTAL: number;
	DESCRIPCION: string;
	DESCUENTO: number;
	IVA_19: number;
	RECIBIDO: number;
	SUBTOTAL: number;
	TOTAL: number;
	VALOR: number;
}

interface Header {
	CLIENTE: string;
	DURACION: string;
	FACTURA_ELECTRONICA_DE_VENTA: string;
	FECHA_DE_INGRESO: Date;
	FECHA_DE_VENTA: string;
	FORMA_DE_PAGO: string;
	MEDIO_DE_PAGO: string;
	NIT: string;
	PLACA: string;
	PUNTO_DE_PAGO: string;
	REGIMEN: string;
}

interface InfoCufe {
	CUFE: string;
	URL: string;
}
