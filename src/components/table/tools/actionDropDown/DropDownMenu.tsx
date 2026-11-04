import { cloneElement, isValidElement, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { DropDownMenuProps } from "./types";
export default function DropDownMenu({ button, children, className }: DropDownMenuProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const trigger = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const menuId = useId();
  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (!open) return;
    const items = () => Array.from(menu.current?.querySelectorAll<HTMLElement>('button,a[href]') || []);
    items()[0]?.focus();
    const close = () => { setOpen(false); trigger.current?.querySelector<HTMLElement>('button,[tabindex]')?.focus(); };
    const outside = (event: MouseEvent) => { if (!menu.current?.contains(event.target as Node) && !trigger.current?.contains(event.target as Node)) setOpen(false); };
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); close(); }
      if (event.key === "Tab") setOpen(false);
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault(); const list = items(); const current = list.indexOf(document.activeElement as HTMLElement);
        list[(current + (event.key === "ArrowDown" ? 1 : -1) + list.length) % list.length]?.focus();
      }
    };
    const reposition = () => { const rect = trigger.current?.getBoundingClientRect(); if (rect) setPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX }); };
    document.addEventListener("mousedown", outside); document.addEventListener("keydown", keydown);
    window.addEventListener("resize", reposition); window.addEventListener("scroll", reposition, true);
    return () => { document.removeEventListener("mousedown", outside); document.removeEventListener("keydown", keydown);
      window.removeEventListener("resize", reposition); window.removeEventListener("scroll", reposition, true); };
  }, [open]);
  const handleOpen = () => {
    const rect = trigger.current?.getBoundingClientRect();
    if (rect) setPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
    setOpen(value => !value);
  };
  const triggerButton = isValidElement(button) ? cloneElement(button as React.ReactElement<Record<string, unknown>>, {
    "aria-expanded": open, "aria-controls": open ? menuId : undefined, "aria-haspopup": "menu",
  }) : button;
  return <div className="rrdt dropdown-container">
    <div ref={trigger} className="dropdown-trigger" onClick={handleOpen} onKeyDown={event => { if (event.key === "ArrowDown") { event.preventDefault(); handleOpen(); } }}>{triggerButton}</div>
    {mounted && open && createPortal(<div ref={menu} id={menuId} className={`rrdt dropdown-menu ${className || ""}`}
      style={{ position: "absolute", ...position, zIndex: 9999 }} onClick={() => { setOpen(false); trigger.current?.querySelector<HTMLElement>('button')?.focus(); }}>{children}</div>, document.body)}
  </div>;
}
