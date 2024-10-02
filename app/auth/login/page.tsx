"use client";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import Image from "next/image";
import OPERATIONLOGO from "@/app/assets/img/LOGO.png";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { UseNavigateContext } from "@/app/context/NavigateContext";
import { UseAuthContext } from "@/app/context/AuthContext";

export default function Login() {
	const { router } = UseNavigateContext();
	const { setToken, setIsAuthenticated, setUser } = UseAuthContext();
	interface UserLogin {
		email: string;
		password: string;
	}

	const { register, handleSubmit } = useForm();
	const onSubmit: SubmitHandler<any> = async (data: UserLogin) => {
		try {
			console.log(process.env.NEXT_PUBLIC_LOCAL_APIURL)
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_LOCAL_APIURL}/users/login`,
				data
			);
			console.log(response.data);
			localStorage.setItem("token", response.data.token);
			if (response.data.token) {
				setToken(response.data.token);
				setUser({
					name: response.data.name,
					lastName: response.data.lastName,
					realm: response.data.realm,
				});
				setIsAuthenticated(true);

				router.push("/parking-payment");
			}
		} catch (error) {
			console.error(error);
			setToken("");
			setIsAuthenticated(false);
			alert("Error en el inicio de sesión");
		}
	};
	return (
		<main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
			<section className="flex flex-col items-center h-full">
				<header className="flex justify-center w-full my-3">
					<Image src={OPERATIONLOGO} alt="..." width={400} />
				</header>
				<Card className="flex flex-col justify-center w-3/6 h-4/6">
					<CardHeader className="h-1/3">
						<h1 className="font-bold text-4xl mx-auto">Iniciar sesión</h1>
					</CardHeader>
					<CardBody>
						<form
							className="flex flex-col justify-around h-full"
							onSubmit={handleSubmit(onSubmit)}
						>
							<Input
								label={"Correo electronico"}
								type="email"
								size="lg"
								variant="faded"
								{...register("email", { required: true })}
							/>
							<Input
								label={"Contraseña"}
								type="password"
								size="lg"
								variant="faded"
								{...register("password", { required: true })}
							/>
							<Button
								className="mx-auto w-full"
								color="primary"
								type="submit"
								size="lg"
								variant="ghost"
							>
								Continuar
							</Button>
						</form>
					</CardBody>
				</Card>
			</section>
		</main>
	);
}
