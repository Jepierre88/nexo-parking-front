// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const ImpresoraComponent = () => {
//   const [impresoras, setImpresoras] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     mostrarImpresoras();
//   }, []);

//   const mostrarImpresoras = async () => {
//     try {
//       // Llama al método del conector para obtener impresoras
//       const conector = new connetor_plugin();
//       const impresorasList = await conector.obtenerImpresoras();
//       setImpresoras(impresorasList);
//       console.log(impresorasList);
//     } catch (error) {
//       console.error("Error al obtener impresoras:", error);
//     }
//   };

//   const imprimir = async () => {
//     let nombreImpresora = "EPSON"; // Ajusta según el nombre de tu impresora
//     let api_key = "123456"; // Ajusta según tu configuración
//     const conector = new connetor_plugin();

//     // Configuración de impresión
//     conector.fontsize("1");
//     conector.textaling("center");
//     conector.text("COINS SAS");
//     conector.text("NIT: 9014489457");
//     conector.text("CRA 48 # 20 - 237");
//     conector.feed("3");
//     conector.textaling("left");
//     conector.text("FACTURA ELECTRONICA DE VENTA: ");
//     // Continúa con el resto del texto...

//     // Realiza la impresión
//     try {
//       setLoading(true);
//       const resp = await conector.imprimir(nombreImpresora, api_key);
//       if (resp === true) {
//         console.log("Impresión exitosa");
//       } else {
//         console.log("Problema al imprimir: " + resp);
//       }
//     } catch (error) {
//       console.error("Error en la impresión:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container">
//       <button onClick={mostrarImpresoras} disabled={loading}>
//         Mostrar Impresoras
//       </button>
//       <br />
//       <br />
//       <button onClick={imprimir} disabled={loading}>
//         Imprimir
//       </button>
//       <br />
//       {loading && <p>Cargando...</p>}
//       <div>
//         <h3>Impresoras Disponibles:</h3>
//         <ul>
//           {impresoras.map((impresora, index) => (
//             <li key={index}>{impresora}</li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default ImpresoraComponent;
