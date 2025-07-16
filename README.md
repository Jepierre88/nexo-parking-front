# NUEVO PUNTO DE PAGO

Actualización de punto de pago

## Descripción de funcionalidad

Todos los datos para enviar a el back serán manejados desde el estado paymentData

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

Puedes ejecutar los siguientes comandos:

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Compila el proyecto para producción
- `npm run start`: Inicia el servidor en producción después de compilar
- `npm run lint`: Ejecuta ESLint para analizar el código y detectar errores

## Dependencias clave

El proyecto utiliza las siguientes bibliotecas y herramientas principales:

- `Next.js`: Framework para construir aplicaciones web rápidas y escalables
- `@nextui-org/react`: Biblioteca de componentes UI modernos y accesibles
- `axios`: Cliente HTTP para realizar solicitudes al backend
- `dotenv`: Manejo de variables de entorno

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

# INSTRUCCIONES DE DESPLIEGUE

Esta guía te ayudará a instalar y desplegar el Frontend de Nexo Parking de manera sencilla.

## Requisitos Previos

- Node.js versión 18 o superior instalado en tu sistema
- Git instalado en tu sistema
- Programa de impresora configurada en tu sistema

## Pasos de Instalación

1. **Clonar el Proyecto**
   ```bash
   cd new-ppa
   ```

2. **Configurar Variables de Entorno**
   - Crea un archivo llamado `.env.production` en la carpeta raíz del proyecto
   - Copia y pega el siguiente contenido, ajustando los valores según tu configuración:

   ```bash
   # URL del Backend API
   # Para red local: NEXT_PUBLIC_LOCAL_APIURL=http://192.168.1.83:3009
   # Para desarrollo local: NEXT_PUBLIC_LOCAL_APIURL=http://localhost:3009
   NEXT_PUBLIC_LOCAL_APIURL=tu_url_del_backend

   # URL del Servicio de Impresión
   # Para impresora local: NEXT_PUBLIC_PRINTER_APIURL=http://localhost:8080
   # Para impresora en red: NEXT_PUBLIC_PRINTER_APIURL=http://192.168.1.50:8080
   NEXT_PUBLIC_PRINTER_APIURL=tu_url_de_impresion

   # Nombre de la Impresora
   # Debe coincidir exactamente con el nombre configurado en el sistema
   # Por defecto: NEXT_PUBLIC_PRINTER_NAME="printer"
   NEXT_PUBLIC_PRINTER_NAME="nombre_de_tu_impresora"
   ```

3. **Generar la Versión de Producción**
   
   En Linux:
   ```bash
   npm run gen-prod
   ```

   En Windows:
   ```bash
   build.bat
   ```

   Esto creará una carpeta llamada `prod` con los archivos necesarios.

4. **Preparar para Despliegue**
   - Elimina todos los archivos y carpetas excepto la carpeta `prod`
   - Ingresa a la carpeta prod:
   Esta carpta tiene que ser movida a `C://COINS/NEXO_PARKING` y renombrarla por: **FRONTEND**
   ```bash
   cd prod
   ```

5. **Iniciar el Servidor**
   ```bash
   node server.js
   ```

6. **Acceder a la Aplicación**
   - Abre tu navegador web
   - Accede a la siguiente URL:
   ```
   http://[ip_del_servidor]:3000/auth/login
   ```
   Reemplaza [ip_del_servidor] con la dirección IP de tu servidor

## Notas Importantes

- Asegúrate de tener todos los permisos necesarios antes de ejecutar los comandos
- Verifica que los puertos necesarios (3000, 3009, 8080) estén disponibles
- Mantén una copia de seguridad antes de eliminar archivos
