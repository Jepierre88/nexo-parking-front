import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
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
        {(onClose) => (
          <>
            <ModalHeader></ModalHeader>
            <ModalBody className="flex flex-col items-center justify-center">
              <h1 className="text-center">{message}</h1>
              <SmallButton label="Cerrar" onClick={() => onClose()} />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
