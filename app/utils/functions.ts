import { useEffect } from "react";
import { UseAuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export const validateCredentials = () => {
	const { user } = UseAuthContext();
	const router = useRouter();
	useEffect(() => {
		if (!user || !user.name || !user.lastName || !user.realm) {
			router.push("/auth/login");
		}
	}, []);
};
