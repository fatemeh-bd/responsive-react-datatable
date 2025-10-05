import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { DropDownMenuProps } from "./types";

const DropDownMenu: React.FC<DropDownMenuProps> = ({
  button,
  children,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  const buttonRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpen = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="relative flex items-center justify-center">
      <div
        className="w-full cursor-pointer"
        onClick={handleOpen}
        ref={buttonRef}
      >
        {button}
      </div>

      {createPortal(
        isOpen && (
          <div
            ref={menuRef}
            style={{
              position: "absolute",
              top: position.top,
              left: position.left,
              zIndex: 9999,
            }}
            className={`w-fit bg-inherit shadow-lg rounded-xl ${className}`}
          >
            {children}
          </div>
        ),
        document.body
      )}
    </div>
  );
};

export default DropDownMenu;
