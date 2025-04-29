import { createContext, useContext, useState, ReactNode } from "react";

interface ModalContextType {
  isOpen: boolean;
  title: string;
  description: string;
  openModal: (
    title: string,
    description: string,
    callback?: VoidFunction
  ) => void;
  closeModal: VoidFunction;
  onSubmit: VoidFunction | undefined;
  setOnSubmit: (callback: VoidFunction) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [onSubmit, setOnSubmitCallback] = useState<VoidFunction | undefined>(
    () => () => {}
  );

  const openModal = (
    title: string,
    description: string,
    callback?: VoidFunction
  ) => {
    setTitle(title);
    setDescription(description);
    setIsOpen(true);
    setOnSubmitCallback(() => callback);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTitle("");
    setDescription("");
  };

  const setOnSubmit = (callback: () => void) => {
    setOnSubmitCallback(() => callback);
  };

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        title,
        description,
        openModal,
        closeModal,
        onSubmit,
        setOnSubmit,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
