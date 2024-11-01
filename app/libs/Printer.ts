// Printer.js
import React, { useState } from 'react';
import axios from 'axios';
const DEFAULT_PLUGIN_URL = "http://localhost:8080";


class Operation {
    accion: string;
    datos:any;
    constructor(accion:string, datos:any) {
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

    agregarOperacion(accion:string, datos:string){
        const operacion = new Operation(accion,datos)
        this.operaciones.push(operacion)
    }

    async imprimir(){
        try{
            const response = await axios.post(`${DEFAULT_PLUGIN_URL}/imprimir`,
               {
                nombre_impresora: this.nombre_impresora,
                operaciones: [
                    ...this.operaciones,
                    {accion: "cut", datos: ""}
                ]
               }
            ) 
        }catch(error){
            console.log("Error al imprimir", error)
        }
    }

   
}
    


