import classNames from "classnames";
import { ReactNode } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot)
    throw new Error("The modal root element was not found in the DOM.");

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center z-50">
    <div
      className="absolute inset-0 bg-black opacity-50"
      onClick={onClose}
    />
    <div className={classNames("relative bg-white rounded-lg p-6 shadow-lg w-1/4")}>
      {children}
    </div>
  </div>,
    modalRoot,
  );
};

export default Modal;
