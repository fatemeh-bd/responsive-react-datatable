import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { CloseIcon } from "../icons";
import type { ColorTheme } from "../types";
interface ModalProps {
  theme: ColorTheme; title: ReactNode; isOpen: boolean; onClose: () => void; children: ReactNode;
  className?: string; childrenClass?: string;
  overflowY?: "overflow__auto" | "overflow__hidden" | "overflow__visible" | "overflow__scroll" | "overflow__clip";
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full" | "fit";
}
export default function Modal({ title, isOpen, onClose, children, className = "", size = "fit", overflowY = "overflow__auto", childrenClass = "", theme }: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const close = useRef(onClose);
  useEffect(() => { close.current = onClose; }, [onClose]);
  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (!isOpen || !mounted) return;
    const previous = document.activeElement as HTMLElement | null;
    const focusable = () => Array.from(panel.current?.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex="0"]') || []);
    (focusable()[0] || panel.current)?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); close.current(); }
      if (event.key !== "Tab") return;
      const items = focusable();
      if (!items.length) { event.preventDefault(); panel.current?.focus(); return; }
      if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items[items.length - 1].focus(); }
      else if (!event.shiftKey && document.activeElement === items[items.length - 1]) { event.preventDefault(); items[0].focus(); }
    };
    document.addEventListener("keydown", keydown);
    return () => { document.removeEventListener("keydown", keydown); previous?.focus(); };
  }, [isOpen, mounted]);
  if (!mounted || !isOpen) return null;
  return createPortal(<div className="rrdt modal-overlay show" onClick={() => onClose()}>
    <div ref={panel} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}
      onClick={event => event.stopPropagation()} style={{ backgroundColor: theme.backgroundColor, color: theme.cellTextColor }}
      className={`modal-container ${size === "2xl" ? "xxl" : size} open ${className}`}>
      <div className="modal-header-wrapper"><div className="modal-header" style={{ backgroundColor: theme.backgroundColor }}>
        <div id={titleId} className="modal-title">{title}</div>
        <button type="button" aria-label="Close dialog" onClick={onClose} className="modal-close-btn"><CloseIcon className="icon-close" /></button>
      </div></div>
      <hr style={{ color: theme.borderColor }} />
      <div className={`modal-body ${overflowY} ${childrenClass}`}>{children}</div>
    </div></div>, document.body);
}
