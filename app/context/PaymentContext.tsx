"use client";
import { PaymentData } from "@/types";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { createEmptyObject } from "../libs/utils";
import { initialPaymentData } from "../libs/initialStates";

// Tipos para los pagos alineados con `extraServices`
interface Payment {
  id: string; // Puede ser `code` en extraServices
  name: string;
  price: number; // `unitPrice` en extraServices
  quantity: number;
  isLocked?: boolean; // Indica si el servicio puede modificarse
}

interface PaymentState {
  payments: Payment[];
  total: number;
}

interface PaymentContextType {
  state: PaymentState;
  dispatch: React.Dispatch<PaymentAction>;
  paymentData: PaymentData;

  clearInputs: () => void;
  setPaymentData: (paymentData: any) => void;
  clearAll: () => void;
}

// Tipos para las acciones del reducer
type PaymentAction =
  | { type: "UPDATE_PAYMENT"; payload: PaymentUpdatePayload }
  | { type: "CLEAR_PAYMENTS" };

// Payload específico para actualizar pagos
interface PaymentUpdatePayload {
  id: string;
  name?: string;
  price: number;
  quantityChange: number;
  isLocked?: boolean;
  ivaAmount: number;
}

// Estado inicial
const initialState: PaymentState = {
  payments: [],
  total: 0,
};

// Reducer actualizado
const paymentReducer = (
  state: PaymentState,
  action: PaymentAction
): PaymentState => {
  switch (action.type) {
    case "UPDATE_PAYMENT":
      const existingServiceIndex = state.payments.findIndex(
        (payment) => payment.id === action.payload.id
      );

      let updatedPayments;

      if (existingServiceIndex !== -1) {
        // Si el servicio ya existe, actualizar su cantidad
        const existingService = state.payments[existingServiceIndex];

        // Verificar si está bloqueado
        if (existingService.isLocked) {
          return state; // No modificar si está bloqueado
        }

        const updatedService = {
          ...existingService,
          quantity: existingService.quantity + action.payload.quantityChange,
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
      } else if (action.payload.quantityChange > 0) {
        // Si el servicio no existe, agregarlo
        updatedPayments = [
          ...state.payments,
          {
            id: action.payload.id,
            name: action.payload.name || "",
            price: action.payload.price,
            quantity: action.payload.quantityChange,
            isLocked: action.payload.isLocked || false,
          },
        ];
      } else {
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
    useState<PaymentData>({
      ...initialPaymentData,
    });

  // Función adicional para limpiar todo
  const clearAll = () => {
    dispatch({ type: "CLEAR_PAYMENTS" });
  };

  useEffect(() => {
    setPaymentData(initialPaymentData)
  }, [])

  return (
    <PaymentContext.Provider
      value={{
        state,
        dispatch,
        clearAll,
        paymentData,
        setPaymentData,
        clearInputs: () => setPaymentData(initialPaymentData), // Ejemplo de función adicional para limpiar los inputs del formulario de pago
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};
