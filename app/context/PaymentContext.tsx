"use client";
import { PaymentData } from "@/types";
import {
	createContext,
	ReactNode,
	useContext,
	useReducer,
	useState,
} from "react";
import { createEmptyObject } from "../libs/utils";
import { initialPaymentData } from "../libs/initialStates";

//TODO ////////////////////////////////////
//TODO ////////////////////////////////////
//TODO ////Crear el tipado de los pagos////
//TODO ////////////////////////////////////
//TODO ////////////////////////////////////
// Tipos para los pagos
interface Payment {
	id: number;
	name: string;
	price: number;
	quantity: number;
}

interface PaymentState {
	payments: Payment[];
	total: number;
}

interface PaymentContextType {
	state: PaymentState;
	dispatch: React.Dispatch<any>;
	paymentData: PaymentData;
	clearInputs: () => void;
	setPaymentData: (paymentData: any) => void;
	clearAll: () => void; // Ejemplo de función adicional
}

// Estado inicial
const initialState: PaymentState = {
	payments: [],
	total: 0,
};

// Reducer
const paymentReducer = (state: PaymentState, action: any): PaymentState => {
	switch (action.type) {
		case "UPDATE_PAYMENT":
			// Buscar el servicio en el estado actual
			const existingServiceIndex = state.payments.findIndex(
				(payment) => payment.id === action.payload.id
			);

			let updatedPayments;

			if (existingServiceIndex !== -1) {
				// Si el servicio ya existe, actualizar su cantidad
				const updatedService = {
					...state.payments[existingServiceIndex],
					quantity:
						state.payments[existingServiceIndex].quantity +
						action.payload.quantity,
				};

				// Si la cantidad llega a 0, eliminar el servicio
				if (updatedService.quantity <= 0) {
					updatedPayments = state.payments.filter(
						(_, index) => index !== existingServiceIndex
					);
				} else {
					updatedPayments = [...state.payments];
					updatedPayments[existingServiceIndex] = updatedService;
				}
			} else if (action.payload.quantity > 0) {
				// Si el servicio no existe, agregarlo
				updatedPayments = [
					...state.payments,
					{ ...action.payload, quantity: action.payload.quantity },
				];
			} else {
				// Si no existe y la cantidad es 0, no hacer nada
				updatedPayments = [...state.payments];
			}

			// Calcular el nuevo total
			const updatedTotal = updatedPayments.reduce(
				(sum, payment) => sum + payment.price * payment.quantity,
				0
			);

			return {
				...state,
				payments: updatedPayments,
				total: updatedTotal,
			};

		case "CLEAR_PAYMENTS":
			return initialState;

		default:
			return state;
	}
};

// Contexto principal
const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

// Custom hook para usar el contexto
export const usePaymentContext = (): PaymentContextType => {
	const context = useContext(PaymentContext);
	if (!context) {
		throw new Error(
			"usePaymentContext debe ser usado dentro de PaymentProvider"
		);
	}
	return context;
};

// Proveedor
export const PaymentProvider = ({ children }: { children: ReactNode }) => {
	const [state, dispatch] = useReducer(paymentReducer, initialState);

	const [paymentData, setPaymentData] =
		useState<PaymentData>(initialPaymentData);

	// Función adicional para limpiar todo
	const clearAll = () => {
		dispatch({ type: "CLEAR_PAYMENTS" });
	};

	return (
		<PaymentContext.Provider
			value={{
				state,
				dispatch,
				clearAll,
				paymentData,
				setPaymentData,
				clearInputs: () => setPaymentData(createEmptyObject<PaymentData>()), // Ejemplo de función adicional para limpiar los inputs del formulario de pago
			}}
		>
			{children}
		</PaymentContext.Provider>
	);
};
