import { CONSTANTS } from "@/config/constants";
import axios from "axios";
import { useState } from "react";

interface ConfigurationData {
  informationConfig: {
    id: number;
    monthlyPaymentType: string;
    deadLine: number;
    graceTimeScheduling: number;
    outcomeTime: number;
    automaticExit: boolean;
    automaticemailClosure: string;
  };
  informationCompany: {
    id: number;
    businessName: string;
    commercialName: string;
    nit: string;
    softwareManufacturer: string;
    technologyProvider: string;
    address: string;
    phone: string;
    fiscalResponsibility: string;
    privacyPolicyInfo: string;
    endDatePolicy: string;
    paymentPointInfo: string;
  };
}

export default function UseConfigurationData() {
  const [configuration, setConfiguration] = useState<ConfigurationData | null>(
    null
  );

  const getConfiguration = async () => {
    try {
      const response = await axios.get(
        `${CONSTANTS.APIURL}/common`
      );
      setConfiguration(response.data);
      console.log("Configuración obtenida:", response.data);
    } catch (error) {
      console.error("Error obteniendo configuración:", error);
    }
  };

  return {
    configuration,
    getConfiguration,
  };
}
