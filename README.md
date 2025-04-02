# NUEVO PUNTO DE PAGO

Actualización de punto de pago

## Descripción de funcionalidad

Todos los datos para enviar a el back seran manejados desde el estado paymentData

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd <NOMBRE_DEL_PROYECTO>
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Clonar el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd <NOMBRE_DEL_PROYECTO>
   ```
4. Configurar las variables de entorno:

- Crea un archivo .env en la raíz del proyecto con las siguientes variables:
  ```php
  NEXT_PUBLIC_PRINTER_APIURL="URL de back de la impresora"
  NEXT_PUBLIC_LOCAL_APIURL="URL de back del punto de pago"
	NEXT_PUBLIC_PRINTER_NAME="NOMBRE DE LA IMPRESORA, NORMALMENTE EPSON O PRINTER"
  ```

5. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Estructura del estado `paymentData`

El estado `paymentData` almacena toda la información necesaria para realizar el pago. Su estructura básica es la siguiente:

```json
{
	"deviceId": "string",
	"identificationType": "string",
	"identificationCode": "string",
	"concept": "string",
	"cashier": "string",
	"plate": "string",
	"datetime": "string",
	"subtotal": "number",
	"IVAPercentage": "number",
	"IVATotal": "number",
	"totalCost": "number",
	"validationDetail": {
		"processId": "string",
		"incomeDatetime": "string"
	},
	"services": [
		{
			"name": "string",
			"quantity": "number",
			"price": "number",
			"total": "number"
		}
	]
}
```

## Scripts disponibles

puedes ejecutar los siguientes comandos:

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Compila el proyecto para producción.
- `npm run start`: Inicia el servidor en producción después de compilar.
- `npm run lint`: Ejecuta ESLint para analizar el código y detectar errores.

## Dependencias clave

El proyecto utiliza las siguientes bibliotecas y herramientas principales:

- `Next.js`: Framework para construir aplicaciones web rápidas y escalables.
- `@nextui-org/react`: Biblioteca de componentes UI modernos y accesibles.
- `axios`: Cliente HTTP para realizar solicitudes al backend.
- `dotenv`: Manejo de variables de entorno.

## Ejemplo de uso

Un ejemplo básico del componente `ParkingPayment` para manejar los cobros:

```jsx
import ParkingPayment from "./components/ParkingPayment";

export default function App() {
	return <ParkingPayment />;
}
```

## Versiones

Este proyecto está diseñado para ejecutarse con las siguientes versiones de herramientas:

- Node.js: `22.3.0`
- Next.js: `14.2.14`
- @nextui-org/react: `2.4.8`
