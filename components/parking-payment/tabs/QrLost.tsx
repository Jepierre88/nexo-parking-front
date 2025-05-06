'use client'
import { usePaymentContext } from "@/app/context/PaymentContext";
import { initialPaymentData } from "@/app/libs/initialStates";
import { clasifyPlate, updatePaymentData } from "@/app/libs/utils";
import { CONSTANTS } from "@/config/constants";
import { getLocalTimeZone, now } from "@internationalized/date";
import { Input } from "@nextui-org/input";
import { Button, DatePicker, Form } from "@nextui-org/react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

export default function QrPerdido() {

  const { setPaymentData, paymentData } = usePaymentContext()
  const [selectedDate, setSelectedDate] = useState<any>(now(getLocalTimeZone()));


  const [debouncedPlate] = useDebounce(paymentData.plate, 1500, {
  });

  const [generationDetail, setGenerationDetail] = useState({
    plate: "",
    generateIncome: false,
    vehicleKind: "MOTO",
    datetime: new Date().toISOString(),
    cashier: ""
  })


  const [shouldValidate, setShouldValidate] = useState(false);

  const router = useRouter();


  const getCashier = () => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      const userData = JSON.parse(userCookie);
      return `${userData.name} ${userData.lastName}`;
    }
    return "Usuario Desconocido";
  };



  const validatePlate = async (plate: string) => {
    // Crear una copia actualizada de generationDetail con la placa actualizada

    const fechaGenerate = new Date(selectedDate.toDate().toString());

    if (fechaGenerate > new Date()) {
      toast.error("La fecha de ingreso no puede ser mayor a la fecha actual");
      return;
    }

    const updatedGenerationDetail = {
      ...generationDetail,
      plate: plate,
      cashier: getCashier(),
      datetime: selectedDate.toDate().toISOString(),
      vehicleKind: clasifyPlate(plate),
    };

    // Limpiar el estado antes de realizar la validación
    setPaymentData({
      ...initialPaymentData,
      plate: plate,
    });

    setGenerationDetail(updatedGenerationDetail);

    try {
      const res = await fetch(`${CONSTANTS.APIURL}/validatePaymentLostQr`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Cookies.get("auth_token")}`,
        },
        body: JSON.stringify(updatedGenerationDetail),
      });

      if (!res.ok) {
        if (res.status === 401) return router.push("/auth/login");
        if (res.status === 500) return toast.error("Error interno del servidor");

        toast.error("Placa no encontrada, digite fecha y hora de ingreso");
        setGenerationDetail({
          ...updatedGenerationDetail,
          generateIncome: true,
        });
        return;
      } else {
        setGenerationDetail({
          ...updatedGenerationDetail,
          generateIncome: false,
        });
      }

      const data = await res.json();

      if (data.status === "error") {
        toast.error(data.message);
        return;
      }

      toast.success("Placa validada correctamente");

      updatePaymentData(data, setPaymentData);
    } catch (error) {
      setPaymentData({
        ...initialPaymentData,
      });
      toast.error("Error al validar la placa");
    }
  };




  useEffect(() => {
    setPaymentData(initialPaymentData);
    setShouldValidate(false);
    const timer = setTimeout(() => setShouldValidate(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!debouncedPlate || debouncedPlate.length < 5 || !shouldValidate) return;
    setGenerationDetail({
      ...generationDetail,
      generateIncome: false
    })
    validatePlate(debouncedPlate)

  }, [debouncedPlate])

  useEffect(() => {
    setGenerationDetail({
      ...generationDetail,
      generateIncome: false,
    })
  }, [paymentData.plate])

  return (
    <section className="flex flex-col gap-3 justify-center items-center">
      <h2 className="font-bold text-2xl text-center">Datos de QR perdido</h2>
      <article className="w-full h-full my-4">
        <Form className="flex flex-col gap-3 max-w-sm mx-auto my-auto">
          <div className="flex w-full justify-between">
            <label htmlFor="plate" className="text-base font-bold text-nowrap my-auto">
              Placa
            </label>
            <Input name="plate" variant="bordered" value={paymentData.plate} maxLength={6} onChange={(e) => {
              setPaymentData({
                ...paymentData,
                plate: e.target.value.toUpperCase(),
              })
            }} className="w-56" />
          </div>

          {
            generationDetail.generateIncome && paymentData.plate && (
              <div className="flex flex-col w-full gap-3">
                <div className="flex w-full justify-between">
                  <label htmlFor="startDateTime" className="text-base font-bold text-nowrap my-auto">
                    Fecha
                  </label>
                  <DatePicker className="w-56" variant="bordered" value={selectedDate} onChange={setSelectedDate} hideTimeZone />
                </div>
                <Button className="mx-auto" color="primary" onPress={() => validatePlate(paymentData.plate)}>Validar cobro</Button>
              </div>
            )
          }
        </Form>
      </article>
    </section>
  );
}
