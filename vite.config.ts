import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/responsive-react-datatable/",
  root: ".",
  server: {
    port: 5173,
  },
});
