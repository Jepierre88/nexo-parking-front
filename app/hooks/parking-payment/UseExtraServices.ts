import ExtraService from "@/types/ExtraService";
import axios from "axios";
import { useEffect, useState } from "react";

export default function UseExtraServices() {
	const [extraServices, setExtraServices] = useState<ExtraService[]>([]);

	useEffect(() => {
		getExtraServices();
	}, []);

	const getExtraServices = async () => {
		try {
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_LOCAL_APIURL}/extraServices`
			);
			setExtraServices(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	return {
		extraServices,
	};
}
