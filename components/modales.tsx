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
            <ModalHeader />
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
        <ModalHeader />
        <ModalBody className="flex flex-col items-center justify-center">
          <h1 className="text-center">{message}</h1>
          <SmallButton
            label="Cerrar"
            onClick={() => {
              modalControl.onClose();
            }}
          />
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
              className="flex-1 mr-2"
              color="primary"
              onClick={() => {
                onConfirm();
                modalControl.onClose();
              }}
            >
              Sí
            </Button>
            <Button
              className="flex-1"
              color="primary"
              onClick={() => modalControl.onClose()}
            >
              No
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
