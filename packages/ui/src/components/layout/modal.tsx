import React from "react";

export default function Modal({
  children,
  isOpen,
}: {
  children: React.ReactNode;
  isOpen: boolean;
}) {
  React.useEffect(() => {
    const dialog = document?.getElementById("terms-modal") as HTMLDialogElement;
    isOpen ? dialog?.showModal() : dialog?.close();
  }, [isOpen]);

  return (
    <>
      <dialog id="terms-modal" className="modal">
        <div className="modal-box flex flex-col items-center">{children}</div>
      </dialog>
    </>
  );
}
