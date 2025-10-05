import React, { useState } from "react";
import { createPortal } from "react-dom";
import { DropDownMenuProps } from "./types";
import { useClickOutside } from "../../hooks/useClickOutside";

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

  const menuRef = useClickOutside<HTMLDivElement>(
    () => setIsOpen(false),
    [setIsOpen]
  );

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
        onClick={(e) => handleOpen(e)}
        ref={menuRef}
      >
        {button}
      </div>

      {createPortal(
        isOpen && (
          <div
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
