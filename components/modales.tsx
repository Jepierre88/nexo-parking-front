import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";

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
            <ModalBody>
              <h1>{message}</h1>
              <Button color="danger" onPress={onClose}>
                Cerrar
              </Button>
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
            <ModalBody>
              <h1>{message}</h1>
              <Button color="danger" onPress={onClose}>
                Cerrar
              </Button>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
