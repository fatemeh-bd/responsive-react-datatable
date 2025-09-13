import React from "react";
import ReactDOM from "react-dom";
import { ModalProps } from "./types";
import { useIsMobile } from "./useIsMobile";

const Modal = ({
  title,
  isOpen,
  onClose,
  children,
  className,
  size = "fit",
  overflowY = "overflow-y-auto",
  childrenClass,
}: ModalProps): React.ReactNode => {
  const handleClose = () => {
    onClose();
  };

  const isMobile = useIsMobile();

  if (!isOpen) return null;

  const modalContent = (
    <div
      onClick={() => {
        if (isMobile) handleClose();
      }}
      className="fixed inset-0 z-[999] bg-[#0000006c]/30 backdrop-blur-[1px] flex items-end md:items-center justify-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative bg-white z-[9999] rounded-t-2xl md:rounded-lg border-secondary-200 mx-0 transition-all duration-300 delay-200 ${
          size === "sm"
            ? "w-[370px]"
            : size === "md"
            ? "w-[750px]"
            : size === "lg"
            ? "w-[1100px]"
            : size === "xl"
            ? "w-[80%]"
            : size === "2xl"
            ? "w-[90%]"
            : size === "full"
            ? "w-[90%]"
            : ""
        } max-md:!w-full ${className || ""}`}
      >
        <div className="px-5">
          <div className="flex pt-5 pb-2 justify-between bg-white items-center">
            {typeof title === "string" ? <h1>{title}</h1> : title}
            <button onClick={handleClose} className="ml-0 block cursor-pointer">
              X
            </button>
          </div>
        </div>
        <hr />
        <div
          className={`p-5 max-h-[90svh] ${childrenClass || ""} ${
            overflowY === "overflow-y-visible"
              ? `md:${overflowY} overflow-y-auto`
              : overflowY
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );

  // cast به React.ReactNode برای رفع ارور TypeScript
  return ReactDOM.createPortal(modalContent as React.ReactNode, document.body);
};

export default Modal;
