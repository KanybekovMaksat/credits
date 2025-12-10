import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  envDir: "config/env",
  publicDir: "src/static",
  server: {
    host: true,
    port: "3001",
  },
  resolve: {
    alias: {
      "@components": "/src/components",
      "@compv2": "/src/componentsv2",
      "@services": "/src/services",
      "@store": "/src/store",
      "@enums": "/src/enums",
      "@helpers": "/src/helpers",
      "@pages": "/src/pages",
    },
  },
});
