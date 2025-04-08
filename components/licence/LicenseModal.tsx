import { activateLicenseAction } from "@/actions/licences";
import { Button, Input, Modal, ModalBody, ModalContent, ModalHeader, ModalProps } from "@nextui-org/react";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";

export default function LicenseModal({
  isOpen,
  onOpenChange,
  onClose,
}: Partial<ModalProps>) {
  const [license, setLicense] = useState("");
  const [loading, setLoading] = useState(false);

  const activateLicense = async () => {
    try {
      setLoading(true);
      const response = await activateLicenseAction(license);
      console.log(response)
      toast.success(response.message);
      setLicense("");
      if (onClose) onClose();
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || "Error al activar la licencia");
      } else {
        toast.error("Error al activar la licencia");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={onClose}
    >
      <ModalContent>
        <ModalHeader className="flex justify-center items-center">
          Activar licencia
        </ModalHeader>
        <hr className="separator" />
        <ModalBody>
          <div className="flex flex-col items-center justify-center gap-5">
            <p>
              Para activar la licencia, debes ingresar el código de la licencia
              en el campo de texto.
            </p>
            <Input
              label={"Licencia"}
              isRequired
              color="primary"
              variant="bordered"
              value={license}
              onChange={(e) => setLicense(e.target.value)}
              classNames={{
                inputWrapper: "bg-white border border-primary",
              }}
            />
            <Button color="primary" onPress={activateLicense} isLoading={loading}>Activar</Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}