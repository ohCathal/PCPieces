import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // During `npm run dev`, forward /api/* to the backend server
      // (started separately with `npm run server`) so the frontend
      // can call fetch("/api/recommend") without CORS issues.
      "/api": "http://localhost:3001",
    },
  },
});
