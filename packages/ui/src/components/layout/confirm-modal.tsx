import Modal from "./modal";
import ArbitrumConnectIcon from "@/assets/arbitrum-connect.svg";
import { useModal } from "@/contexts/modal-context";

export default function ConfirmModal() {
  const { isOpen, title, description, closeModal, onSubmit } = useModal();

  const handleClick = () => {
    onSubmit && onSubmit();
    closeModal();
  };
  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <div className="flex flex-col items-center">
        <img
          src={ArbitrumConnectIcon}
          alt="arbitrum icon"
          className="w-12 h-12"
        />
        <div className="text-xl mt-3">{title}</div>
        <div className="text-lg mt-1 text-center text-gray-600">
          {description}
        </div>
        <button
          type="button"
          className="btn btn-primary mt-4"
          onClick={handleClick}
        >
          Confirm
        </button>
      </div>
    </Modal>
  );
}
