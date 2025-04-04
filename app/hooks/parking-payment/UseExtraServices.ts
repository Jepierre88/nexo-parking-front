import { CONSTANTS } from "@/config/constants";
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
				`${CONSTANTS.APIURL}/services`, {
				headers: {
					type: "extra"
				}
			}
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
