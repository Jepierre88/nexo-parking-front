import { Button } from "@nextui-org/button";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/modal";
import SmallButton from "./smallButton";

interface ModalControls {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: () => void;
  onClose: () => void;
}

export const ModalError = ({
  modalControl,
  message,
}: {
  modalControl: ModalControls;
  message: string;
}) => {
  return (
    <Modal
      isOpen={modalControl.isOpen}
      onOpenChange={modalControl.onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader></ModalHeader>
            <ModalBody className="flex flex-col items-center justify-center">
              <h1 className="center">{message}</h1>
              <SmallButton label="Cerrar" onClick={() => onClose()} />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export const ModalExito = ({
  modalControl,
  message,
}: {
  modalControl: ModalControls;
  message: string;
}) => {
  return (
    <Modal
      isOpen={modalControl.isOpen}
      onOpenChange={modalControl.onOpenChange}
    >
      <ModalContent>
        <ModalHeader></ModalHeader>
        <ModalBody className="flex flex-col items-center justify-center">
          <h1 className="text-center">{message}</h1>
          <SmallButton
            label="Cerrar"
            onClick={() => {
              modalControl.onClose();
            }}
          ></SmallButton>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export const ModalConfirmation = ({
  modalControl,
  message,
  title,
  onConfirm,
}: {
  modalControl: ModalControls;
  message: string;
  title: string;
  onConfirm: () => void;
}) => {
  return (
    <Modal
      isOpen={modalControl.isOpen}
      onOpenChange={modalControl.onOpenChange}
    >
      <ModalContent>
        <ModalHeader className="flex items-center">
          <span className="font-bold">{title}</span>
        </ModalHeader>
        <ModalBody className="flex flex-col items-center">
          <p className="text-center mb-4">{message}</p>
          <div className="flex justify-around w-full">
            <Button
              onClick={() => {
                onConfirm();
                modalControl.onClose();
              }}
              color="primary"
              className="flex-1 mr-2"
            >
              Sí
            </Button>
            <Button
              onClick={() => modalControl.onClose()}
              color="primary"
              className="flex-1"
            >
              No
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
