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
    | "overflow__auto"
    | "overflow__hidden"
    | "overflow__visible"
    | "overflow__scroll"
    | "overflow__clip";
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full" | "fit";
}

const Modal: React.FC<ModalProps> = ({
  title,
  isOpen,
  onClose,
  children,
  className,
  size = "fit",
  overflowY = "overflow__auto",
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
        className={`modal-overlay ${isOpen ? "show" : "hide"}`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ backgroundColor: theme?.backgroundColor }}
          className={`modal-container ${
            size === "sm"
              ? "sm"
              : size === "md"
              ? "md"
              : size === "lg"
              ? "lg"
              : size === "xl"
              ? "xl"
              : size === "2xl"
              ? "xxl"
              : size === "full"
              ? "full"
              : size === "fit"
              ? "fit"
              : ""
          } ${isOpen ? "open" : ""} ${className || ""}`}
        >
          <div className="modal-header-wrapper">
            <div
              style={{ background: theme?.backgroundColor }}
              className="modal-header"
            >
              {typeof title === "string" ? (
                <p className="modal-title">{title}</p>
              ) : (
                title
              )}
              <button onClick={handleClose} className="modal-close-btn">
                <CloseIcon className="icon-close" />
              </button>
            </div>
          </div>

          <hr style={{ color: theme?.borderColor }} />

          <div
            className={`modal-body ${overflowY} ${childrenClass || ""}`}
            style={{
              backgroundColor: theme?.backgroundColor,
            }}
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
