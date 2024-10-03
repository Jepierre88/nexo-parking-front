import axios from "axios";
import { useEffect, useState } from "react";

export default function UseUsers() {
	const [users, setUsers] = useState<any[]>([]); 

	const getUsers = async () => {
		try {
			const response = await axios.get(`${process.env.NEXT_PUBLIC_LOCAL_APIURL}/users`);
			/*Con esta funcion de declarar la variable y mandarle el array de los datos puedo realizar filtros
			*/ 
			const arrayfilter:any[] = response.data 
			setUsers(arrayfilter.filter(Item => Item.realm !== "Consultorio" && Item.realm !== "consultorio" ))

		} catch (error) {
			setUsers([]);
			console.error(error);
		}
	};

	useEffect(() => {
		getUsers();
	}, []);

	return {users}; 
}