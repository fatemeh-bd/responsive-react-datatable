import React, { ReactNode } from "react";
import ReactDOM from "react-dom";
import { useIsMobile } from "../hooks/useIsMobile";
import { CloseIcon } from "../icons";
import { ColorTheme } from "../types";
interface ModalProps {
  theme: ColorTheme;
  title: string | ReactNode;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  childrenClass?: string;
  overflowY?:
    | "overflow-y-auto"
    | "overflow-y-hidden"
    | "overflow-y-visible"
    | "overflow-y-scroll"
    | "overflow-y-clip";
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full" | "fit";
}

const Modal: React.FC<ModalProps> = ({
  title,
  isOpen,
  onClose,
  children,
  className,
  size = "fit",
  overflowY = "overflow-y-auto",
  childrenClass,
  theme,
}) => {
  const handleClose = () => {
    onClose();
  };
  const isMobile = useIsMobile();
  return (
    isOpen &&
    ReactDOM.createPortal(
      <div
        onClick={() => {
          if (isMobile) handleClose();
        }}
        className={`fixed inset-0 z-[999] bg-black/30 backdrop-blur-xs flex items-end md:items-center justify-center ${
          isOpen ? "translate-y-0" : "translate-y-full delay-500"
        }`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ backgroundColor: theme?.backgroundColor }}
          className={`relative z-50 rounded-t-2xl md:rounded-lg border-secondary-200 mx-0  transition-all duration-300 delay-200 ${
            isOpen ? "opacity-100" : "opacity-0"
          } md:max-w-[90%] ${
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
          }  max-md:!w-full ${className || ""}`}
        >
          <div className="px-5">
            <div
              style={{ background: theme?.backgroundColor }}
              className="flex pt-5 pb-2 justify-between items-center"
            >
              {typeof title === "string" ? (
                <p className="!mb-0">{title}</p>
              ) : (
                title
              )}
              <button
                onClick={handleClose}
                className="ml-0 block cursor-pointer"
              >
                <CloseIcon className="w-6 h-6 text-secondary-600" />
              </button>
            </div>
          </div>
          <hr></hr>
          <div
            className={`p-5 max-h-svh ${childrenClass} ${
              overflowY === "overflow-y-visible"
                ? `${"md:" + overflowY} overflow-y-auto`
                : overflowY
            }`}
          >
            {children}
          </div>
        </div>
      </div>,
      document.body
    )
  );
};

export default Modal;
