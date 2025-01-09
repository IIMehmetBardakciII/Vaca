"use client";

import { cn } from "@/lib/utils";
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
    const dialog = dialogRef.current;
    if (open) {
      dialog?.showModal();
      requestAnimationFrame(() => {
        if (dialog) {
          dialog.style.opacity = "1";
          dialog.style.transform = "scale(1)";
        }
      });
    } else {
      if (dialog) {
        dialog.style.opacity = "0";
        dialog.style.transform = "scale(0.9)";
        setTimeout(() => dialog.close(), 100); // Animasyon süresine eşit olmalı
      }
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onCancel={onClose}
      className={cn(
        "backdrop:bg-black/60 rounded-md scale-0 transition-all ease-in duration-300 bg-secondary shadow-lg ",
        className
      )}
      style={{
        opacity: 0,
        transform: "scale(0.9)",
        transition: "opacity 0.1s, transform 0.1s",
      }}
    >
      <div className=" rounded-md w-96 p-6 relative ">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-primary hover:text-gray-700"
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
