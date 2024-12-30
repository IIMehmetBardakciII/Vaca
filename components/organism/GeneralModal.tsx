"use client";

import { useRef, useEffect } from "react";

type GeneralModalType = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
};

const GeneralModal = ({
  open,
  onClose,
  children,
  className = "",
}: GeneralModalType) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onCancel={onClose}
      className={`backdrop:bg-black/60 rounded-md ${className}`}
    >
      <div className="bg-secondary rounded-md shadow-lg w-96 p-6 relative ">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✖
        </button>
        {children}
      </div>
    </dialog>
  );
};

export default GeneralModal;
