import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
export default defineConfig({ plugins: [react()], resolve: { alias: {
  "react-responsive-datatable-kit": fileURLToPath(new URL("./src/index.ts", import.meta.url)),
} }, test: {
  environment: "jsdom", include: ["tests/**/*.test.{ts,tsx}"],
  setupFiles: ["./tests/setup.ts"], restoreMocks: true,
} });
