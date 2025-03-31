import { NextResponse } from "next/server";
import axios from "axios";
import { MonthlySubscriptionPaymentData } from "@/types";
import { UseAuthContext } from "@/app/context/AuthContext";
import { CONSTANTS } from "@/config/constants";

export async function POST(request: Request) {
  try {
    const { user } = UseAuthContext();

    const body = await request.json();
    const requestData: MonthlySubscriptionPaymentData = {
      identificationType: body.identificationType,
      identificationCode: body.identificationCode,
      vehicleKind: body.vehicleKind,
      plate: body.plate,
      datetime: new Date().toISOString(),
      cashier: user?.name || "No Asignado",
      concept: body.concept.name,
      subtotal: body.subtotal,
      IVAPercentage: body.IVAPercentage,
      IVATotal: body.IVATotal,
      total: body.total,
      monthlySubscriptionStartDatetime: body.monthlySubscriptionStartDatetime,
      monthlySubscriptionEndDatetime: body.monthlySubscriptionEndDatetime,
      generationDetail: {
        paymentType: body.paymentType,
        cashValue: body.cashValue,
        returnValue: body.returnValue,
      },
    };

    // Envío de la solicitud al backend
    const response = await axios.post(
      `${CONSTANTS.APIURL}/access-control/monthly-subscription-serviceNewPP/generate`,
      requestData
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error en monthly subscription generation:", error);
    return NextResponse.json(
      {
        isSuccess: false,
        messageTitle: "Error",
        messageBody:
          error.response?.data?.message ||
          "Error generating monthly subscription",
      },
      { status: error.response?.status || 500 }
    );
  }
}
