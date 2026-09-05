import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Chrome, Safari, Firefox, Edge — covers Brave (Chromium) too
    target: ["es2020", "chrome87", "firefox78", "safari14", "edge88"],
    cssTarget: ["chrome87", "firefox78", "safari14", "edge88"],
    sourcemap: false,
    chunkSizeWarningLimit: 900,
  },
  preview: {
    port: 4173,
  },
});
