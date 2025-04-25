import { CONSTANTS } from "@/config/constants";
import { useEffect, useState } from "react";

interface City {
  id: number;
  cityName: string;
  StateName: string;
}

interface FiscalResponsability {
  id: number;
  code: string;
  description: string;
}

interface IdentificationType {
  id: number;
  identification: string;
}

export default function useElectronicBilling() {
  const [identificationTypes, setIdentificationTypes] = useState<IdentificationType[]>([]);
  const [fiscalResponsabilities, setFiscalResponsabilities] = useState<FiscalResponsability[]>([]);
  const [cityList, setCityList] = useState<City[]>([]);

  const fetchInformation = async () => {
    const responses = await Promise.all([
      fetch(`${CONSTANTS.APIURL}/listIdentificationType`),
      fetch(`${CONSTANTS.APIURL}/listFiscalResponsibilities`),
      fetch(`${CONSTANTS.APIURL}/cityList`),
    ]).then((responses) => {
      if (!responses[0].ok) throw new Error("Error al obtener los tipos de identificación");
      if (!responses[1].ok) throw new Error("Error al obtener las responsabilidades fiscales");
      if (!responses[2].ok) throw new Error("Error al obtener la lista de ciudades");
      return responses;
    });

    return {
      identificationTypes: await responses[0].json(),
      fiscalResponsabilities: await responses[1].json(),
      cityList: await responses[2].json(),
    }
  }

  useEffect(() => {
    fetchInformation().then((data) => {
      setIdentificationTypes(data.identificationTypes);
      setFiscalResponsabilities(data.fiscalResponsabilities);
      setCityList(data.cityList);
    })
  }, [])

  return {
    identificationTypes,
    fiscalResponsabilities,
    cityList
  }

}