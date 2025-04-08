import { Input, Modal, ModalBody, ModalContent, ModalContentProps, ModalHeader, ModalProps } from "@nextui-org/react";

export default function LicenceModal({
  isOpen,
  onOpenChange,
  onClose,
}: Partial<ModalProps>) {
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
          <div className="flex flex-col items-center justify-center">
            <p>
              Para activar la licencia, debes ingresar el código de la licencia
              en el campo de texto.
            </p>
            <Input
              label={"Licencia"}
              isRequired
              color="primary"
              variant="bordered"
              classNames={{
                inputWrapper: "bg-white border border-primary",
              }}
            />
          </div>
        </ModalBody>
      </ModalContent>

    </Modal>
  )
}