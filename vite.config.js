import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 5173 is already in use by another local project (Mousumi Tailor);
    // this app runs on 5174 to avoid colliding with it.
    port: 5174,
    strictPort: true,
    open: false,
  },
});
