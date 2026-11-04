import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
afterEach(() => {
  cleanup();
  window.history.replaceState(null, "", "/");
  sessionStorage.clear();
  Object.defineProperty(window, "innerWidth", { value: 1024, writable: true });
});
