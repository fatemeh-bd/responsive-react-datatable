import { useEffect, useRef } from "react";

export const useClickOutside = <T extends HTMLElement>(
  callback: () => void,
  deps: any[] = [],
) => {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Clean up with a check to avoid null error
    return () => {
      if (ref.current) {
        document.removeEventListener("mousedown", handleClickOutside);
      }
    };
  }, deps);

  return ref;
};
