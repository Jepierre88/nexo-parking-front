import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import axios from "axios";
import { useEffect } from "react";
import { Checkbox } from "@nextui-org/checkbox";

import UseServices from "../hooks/UseServices";

import { UserData } from "@/types";

export default function VisitanteQr({
  userData,
  setUserData,
}: {
  userData: UserData;
  setUserData: (userdata: UserData) => void;
}) {
  useEffect(() => {
    if (userData.identificationCode.length > 15) {
      searchDataValidate();
    }
  }, [userData.identificationCode]);

  const { services, isLoading } = UseServices("Visitante");
  const searchDataValidate = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_LOCAL_APIURL}/access-control/visitor-service/validateNewPP`,
        {
          identificationType: "QR",
          identificationCode: userData.identificationCode,
          plate: userData.plate,
        },
      );

      setUserData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <article className="flex flex-col gap-2">
      <h2 className="font-bold text-2xl text-center ">
        Datos de visitante (QR)
      </h2>
      <form className="flex flex-col gap-2 px-4">
        <div className="flex gap-4 justify-between">
          <label
            className="text-base font-bold text-nowrap my-auto"
            htmlFor="services"
          >
            Tipo de visitante (QR)
          </label>
          <Select className="w-52" label="Seleccionar" size="sm">
            {services &&
              services.map((item, index) => {
                return (
                  <SelectItem key={index} color="primary" value={item.id}>
                    {item.name}
                  </SelectItem>
                );
              })}
          </Select>
        </div>
        <div className="flex gap-4 justify-between">
          <label
            className="text-base font-bold text-nowrap my-auto"
            htmlFor="QR"
          >
            QR
          </label>
          <Input
            className="w-1/2"
            variant="underlined"
            onChange={(e) => {
              setUserData({ ...userData, identificationCode: e.target.value });
            }}
          />
        </div>
        <div className="flex gap-4 justify-between">
          <label
            className="text-base  font-bold text-nowrap my-auto "
            htmlFor="plate"
          >
            Placa
          </label>
          <Input
            className="w-1"
            value={userData.plate}
            variant="underlined"
            onChange={(e) =>
              setUserData({ ...userData, plate: e.target.value.toUpperCase() })
            }
          />
        </div>
        <div className="flex flex-col place-items-end mb-1 my-2">
          <Checkbox color="primary">
            <p className="text-gray-600  text-base my-1 mr-2">
              Pagar día completo
            </p>
          </Checkbox>
        </div>
        <div className="flex gap-4 justify-between ">
          <label
            className="text-base font-bold text-nowrap my-auto"
            htmlFor="discount"
          >
            Código de descuento
          </label>
          <Input className="w-1/2" variant="underlined" />
        </div>
        <div className="flex gap-4 justify-between">
          <label
            className="text-base font-bold text-nowrap my-auto px-6"
            htmlFor="startDatetime"
          >
            Fecha de entrada
          </label>
        </div>
        <div className="flex gap-4 justify-between">
          <label
            className="text-base font-bold text-nowrap my-auto px-9"
            htmlFor="endDatetime"
          >
            Pago hasta
          </label>
        </div>
      </form>
    </article>
  );
}
