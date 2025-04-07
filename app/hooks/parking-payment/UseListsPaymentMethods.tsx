import { CONSTANTS } from "@/config/constants";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export default function UseListsPaymentMethods(type: string) {
	const [namePaymentType, setnamePaymentType] = useState<any[]>([]);
	const getnamePaymentType = async () => {
		try {
			const response = await axios.get(
				`${CONSTANTS.APIURL}/listPaymentsTypes`,
				{
					params: {
						namePaymentType: type,
					},
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${Cookies.get("auth_token")}`,
					},
				}
			);
			setnamePaymentType(response.data);
		} catch (error) {
			setnamePaymentType([]);
			console.error(error);
		}
	};

	useEffect(() => {
		getnamePaymentType();
	}, []);

	return {
		namePaymentType,
		getnamePaymentType,
	};
}
