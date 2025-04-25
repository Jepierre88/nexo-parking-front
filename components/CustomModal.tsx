import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function CustomModal({ isOpen, children }: CustomModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 z-[9999]"
          >
            {children}

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
