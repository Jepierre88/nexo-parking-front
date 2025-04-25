"use client";

import useElectronicBilling from "@/app/hooks/parking-payment/UseElectronicBilling";
import { CONSTANTS } from "@/config/constants";
import { Receipt } from "@mui/icons-material";
import { Button } from "@nextui-org/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter } from "@nextui-org/drawer";
import { Autocomplete, AutocompleteItem, Checkbox, Input, Select, SelectItem, Spinner, Tooltip } from "@nextui-org/react";
import { useDisclosure } from "@nextui-org/use-disclosure";
import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useDebounce } from "use-debounce";
import CustomModal from "../CustomModal";

export default function ElectronicBillDialog() {

  const { handleSubmit, control, setError, formState: { errors }, setValue, clearErrors, reset } = useForm({
    defaultValues: {
      identification: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      address: '',
      personType: '',
      idIdentificationType: '',
      cityId: '',
      idCodeFiscalResponsabilities: [],
      vatResponsible: false,
      contactFirstName: '',
      contactLastName: '',
    }

  });
  const { isOpen: isOpenDrawer, onOpen: onOpenDrawer, onClose: onCloseDrawer } = useDisclosure();
  const existModal = useDisclosure();
  const successModal = useDisclosure();
  const errorModal = useDisclosure();


  const identification = useWatch({ control, name: "identification" });
  const personType = useWatch({ control, name: "personType" });

  const [debouncedIdentificationNumber] = useDebounce(identification, 1500);

  const { cityList, fiscalResponsabilities, identificationTypes } = useElectronicBilling();

  const [errorMessage, setErrorMessage] = useState("Hubo un problema al enviar la información. Intenta nuevamente.");
  const [loadingDocument, setLoadingDocument] = useState(false);
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [suggestedData, setSuggestedData] = useState<{
    nit: string;
    razonSocial: string;
    formaJuridica: string;
  } | null>(null);



  const onSubmit = async (formData: any) => {
    setLoadingRequest(true);
    try {
      const dataCreate = {
        ...formData,
        cityId: formData.cityId ? parseInt(formData.cityId) : undefined,
        idCodeFiscalResponsabilities: formData.idCodeFiscalResponsabilities
          ? formData.idCodeFiscalResponsabilities.map((item: any) => parseInt(item))
          : undefined,
        idIdentificationType: parseInt(formData.idIdentificationType),
        contactFirstName: undefined,
        contactLastName: undefined,
        contacts: formData.personType === "Company"
          ? [{ firstName: formData.contactFirstName, lastName: formData.contactLastName }]
          : undefined,
      };

      const response = await fetch(`${CONSTANTS.APIURL}/createCustomerSiigo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataCreate),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData);
        setErrorMessage(errorData?.message || "Error desconocido del servidor.");
        errorModal.onOpen();
        throw new Error(errorData?.message || "Error al enviar el formulario");
      }


      const data = await response.json();
      console.log("Respuesta:", data);
      successModal.onOpen();
      reset();
      setSuggestedData(null);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoadingRequest(false);
    }

  };

  const searchForInformation = (identificationNumber: string) => {
    setLoadingDocument(true);
    setSuggestedData(null);
    fetch(`${CONSTANTS.APIURL}/searchInfoCustomer/${identificationNumber}`)
      .then(response => {
        if (!response.ok) {
          setError("identification", {
            message: "No se encontró información para este número de documento",
          });
          return;
        }
        setSuggestedData(null);
        return response.json();
      })
      .then((data) => {
        if (data?.exist) {
          existModal.onOpen();
          setSuggestedData(null);
          return;
        }
        if (data?.data) {
          window.scrollTo({ top: 0, behavior: "smooth" });
          setSuggestedData(data.data); // GUARDAMOS los datos sugeridos
        }
      })
      .finally(() => {
        setLoadingDocument(false);
      });
  };


  useEffect(() => {
    if (debouncedIdentificationNumber?.length > 4) {
      searchForInformation(debouncedIdentificationNumber);
    }
  }, [debouncedIdentificationNumber]);

  useEffect(() => {
    setValue("firstName", "");
    setValue("lastName", "");
    setValue("email", "");
    setValue("phoneNumber", "");
    clearErrors(["firstName", "lastName", "email", "phoneNumber"]);

    if (personType === "Person") {
      setValue("vatResponsible", false);
    }
  }, [personType]);
  return (
    <div>
      {/* Botón flotante */}
      <Tooltip content="Registrar tercero" placement="left">
        <Button
          isIconOnly
          className="fixed right-4 transform z-50 top-32 rounded-full"
          color="primary"
          onPress={onOpenDrawer}
        >
          <Receipt />
        </Button>
      </Tooltip>

      {/* Drawer */}
      <Drawer isOpen={isOpenDrawer} placement="right" onClose={onCloseDrawer}>
        <DrawerContent>
          <DrawerHeader>
            <h2 className="text-xl font-bold">Registro de tercero</h2>
          </DrawerHeader>
          <DrawerBody className="relative">






            <div className="mb-6 text-sm text-gray-600 px-6">
              <p className="mb-2">
                Por favor diligencia la siguiente información para registrar un nuevo tercero.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Selecciona el tipo de documento y digita el número correspondiente.</li>
                <li>Verifica si el tercero ya existe en el sistema (se hace automáticamente).</li>
                <li>Completa los datos personales o de empresa, dependiendo del tipo de persona.</li>
                <li>Todos los campos marcados con * son obligatorios.</li>
                <li>Si el tercero es una empresa, deberás ingresar los datos de contacto de una persona responsable.</li>
              </ul>
            </div>

            {/**
             * 
             * 
             *  Datos sugeridos
             * 
             * 
             */}


            {suggestedData && (
              <div className="mb-6 px-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-blue-600 font-semibold mb-2">Datos sugeridos</h3>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p><span className="font-medium">NIT:</span> {suggestedData.nit}</p>
                    <p><span className="font-medium">Razón Social:</span> {suggestedData.razonSocial}</p>
                    <p><span className="font-medium">Forma Jurídica:</span> {suggestedData.formaJuridica}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Por favor verifica y completa los datos antes de continuar.</p>
                </div>
              </div>
            )}

            {/* 
            *
            *
            * Formulario 
            *
            *
            */}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white rounded-xl shadow-sm p-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Tipo de Documento */}
                <Controller
                  control={control}
                  name="idIdentificationType"
                  rules={{ required: "Tipo de documento requerido" }}
                  render={({ field }) => (
                    <Autocomplete
                      label="Tipo de Documento"
                      placeholder="Seleccione tipo de documento"
                      className="w-full"
                      selectedKey={field.value}
                      isRequired
                      onSelectionChange={field.onChange}
                    >
                      {identificationTypes.map((type) => (
                        <AutocompleteItem key={type.id}>
                          {type.identification}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                  )}
                />

                {/* Documento */}
                <Controller
                  control={control}
                  name="identification"
                  rules={{ required: "Número de documento requerido" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Número de Documento"
                      isRequired
                      maxLength={16}
                      placeholder="Ingrese su número de documento"
                      isDisabled={loadingDocument}
                      endContent={loadingDocument ? <Spinner className="animate-spin" /> : null}
                      errorMessage={errors.identification?.message}
                    />
                  )}
                />

                {/* Ciudad */}
                <Controller
                  control={control}
                  name="cityId"
                  rules={{ required: "Ciudad requerida" }}
                  render={({ field }) => (
                    <Autocomplete
                      label="Ciudad y Departamento"
                      placeholder="Seleccione la ciudad"
                      className="w-full"
                      isRequired
                      selectedKey={field.value}
                      onSelectionChange={field.onChange}
                    >
                      {cityList.map((city) => (
                        <AutocompleteItem key={city.id}>
                          {`${city.cityName}, ${city.StateName}`}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                  )}
                />

                {/* Responsabilidad Fiscal */}
                <Controller
                  control={control}
                  name="idCodeFiscalResponsabilities"
                  rules={{ required: "Seleccione al menos una responsabilidad fiscal" }}
                  render={({ field }) => (
                    <Select
                      label="Responsabilidad Fiscal"
                      isRequired
                      placeholder="Seleccione una o más"
                      selectionMode="multiple"
                      selectedKeys={field.value || []}
                      onSelectionChange={(keys) => field.onChange(Array.from(keys))}
                      className="w-full"
                    >
                      {fiscalResponsabilities.map((item) => (
                        <SelectItem key={item.id} textValue={item.code}>
                          <div className="flex flex-col">
                            <span className="font-medium">{item.code}</span>
                            <span className="text-xs text-gray-500">{item.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                />

                {/* Tipo de Persona */}
                <Controller
                  name="personType"
                  control={control}
                  rules={{ required: "Tipo de persona requerido" }}
                  render={({ field }) => (
                    <Select
                      label="Tipo de Persona"
                      placeholder="Selecciona el tipo de Persona"
                      isRequired
                      selectedKeys={field.value ? [field.value] : []}
                      onSelectionChange={(keys) => field.onChange(Array.from(keys)[0])}
                      className="w-full"
                    >
                      <SelectItem key="Person">Persona natural</SelectItem>
                      <SelectItem key="Company">Persona jurídica</SelectItem>
                    </Select>
                  )}
                />

                {/* Nombre o Razón Social */}
                <Controller
                  control={control}
                  name="firstName"
                  rules={{
                    required: {
                      value: true,
                      message: personType === "Person" ? "El nombre es requerido" : "La razón social es requerida",
                    }
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label={personType === "Person" ? "Nombre" : "Razón Social"}
                      isRequired
                      isDisabled={!personType}
                      placeholder={personType === "Person" ? "Ingrese su nombre" : "Ingrese la razón social"}
                      errorMessage={errors.firstName?.message}
                    />
                  )}
                />

                {personType === "Company" && (
                  <>
                    <Controller
                      control={control}
                      name="contactFirstName"
                      rules={{ required: "Nombre del contacto requerido" }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="Nombre del contacto"
                          placeholder="Ingrese el nombre de la persona de contacto"
                          isRequired
                          errorMessage={errors.contactFirstName?.message}
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name="contactLastName"
                      rules={{ required: "Apellido del contacto requerido" }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="Apellido del contacto"
                          placeholder="Ingrese el apellido de la persona de contacto"
                          isRequired
                          errorMessage={errors.contactLastName?.message}
                        />
                      )}
                    />
                  </>
                )}





                {/* Apellido (solo para Persona) */}
                {personType === "Person" && (
                  <Controller
                    control={control}
                    name="lastName"
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Apellido"
                        placeholder="Ingrese su primer apellido"
                      />
                    )}
                  />
                )}

                {/* Email */}
                <Controller
                  control={control}
                  name="email"
                  rules={{ required: "Correo requerido" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="email"
                      label="Correo Electrónico"
                      placeholder="Ingrese su correo electrónico"
                      isRequired
                      errorMessage={errors.email?.message}
                    />
                  )}
                />

                {/* Teléfono */}
                <Controller
                  control={control}
                  name="phoneNumber"
                  rules={{ required: "Teléfono requerido" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="tel"
                      label="Teléfono"
                      placeholder="Ingrese su número de teléfono"
                      isRequired
                      errorMessage={errors.phoneNumber?.message}
                    />
                  )}
                />

                {/* Dirección */}
                <Controller
                  control={control}
                  name="address"
                  rules={{ required: "Dirección requerida" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Dirección"
                      placeholder="Ingrese su dirección"
                      isRequired
                      errorMessage={errors.address?.message}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="vatResponsible"
                  render={({ field: { onChange, onBlur, value, name, ref } }) => (
                    <Checkbox
                      id="vatResponsible"
                      isSelected={value}
                      onValueChange={onChange}
                      onBlur={onBlur}
                      name={name}
                      ref={ref}
                      isDisabled={personType === "Person"}
                      className="text-sm"
                    >
                      ¿Responsable de IVA?
                    </Checkbox>
                  )}
                />

              </div>

              <div className="flex justify-center mt-8">
                <Button
                  type="submit"
                  isLoading={loadingRequest}
                  key={personType}
                  className="bg-blue-600 text-white hover:bg-blue-700 transition-colors px-8 py-2"
                >
                  Registrar
                </Button>
              </div>
            </form>

            {/**
             * 
             * MODALES
             * 
             * 
             */}


          </DrawerBody>
          <CustomModal isOpen={successModal.isOpen} onClose={successModal.onClose}>
            <div className="flex flex-col items-center text-center p-4">
              {/* <FaCheckCircle className="text-green-500 text-5xl mb-2" /> */}
              <h2 className="text-xl font-semibold text-green-600 mb-2">¡Registro exitoso!</h2>
              <p className="text-gray-700">El usuario ha sido creado correctamente.</p>
              <Button
                onPress={successModal.onClose}
                className="mt-4 bg-green-600 text-white hover:bg-green-700"
              >
                Aceptar
              </Button>
            </div>
          </CustomModal>
          <CustomModal isOpen={existModal.isOpen} onClose={existModal.onClose}>
            <div className="flex flex-col items-center text-center p-4">
              <h2 className="text-xl font-semibold mb-2">El usuario ya ha sido creado previamente</h2>
              <Button color="primary" variant="bordered" onPress={() => {
                existModal.onClose()
                setSuggestedData(null)
                reset()
              }}>Cerrar</Button>
            </div>
          </CustomModal>
          <DrawerFooter>
            <Button color="danger" variant="light" onPress={onCloseDrawer}>
              Cerrar
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}