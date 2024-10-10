import axios from "axios"; 
import { useEffect, useState } from "react";
import moment from 'moment'; 
import { patch } from "@mui/material";

export default function UseIncomes() {
	const [incomes, setIncomes] = useState<any[]>([]); 

	const getIncomes = async (startDateTime?: Date, endDateTime?: Date) => {
		try {
			const response = await axios.get(`${process.env.NEXT_PUBLIC_LOCAL_APIURL}/incomes/pp`, {
				params: {
					startDateTime:startDateTime?.toISOString(),
					endDateTime:endDateTime?.toISOString()},
			});
			
			console.log(response.data);
			const arrayfilter: any[] = response.data;
			setIncomes(arrayfilter.filter(item => item.realm !== "Consultorio" && item.realm !== "consultorio"));

		} catch (error) {
			console.error("error al obtener ingresos: ", error);
			setIncomes([]);
			
		}
	};
	
	const updatePlate = async (id: string, plate: string) => {
		try {
			const response = await axios.patch(`${process.env.NEXT_PUBLIC_LOCAL_APIURL}/incomes/${id}`, 
				{
				plate: plate,
			});
			console.log('Placa actualizada:', response.data);
		} catch (error) {
			console.error('Error actualizando la placa: ',error);
		}
	};


	useEffect(() => {
		getIncomes();
	}, []);

	return { incomes, getIncomes, updatePlate, setIncomes}; 
}
