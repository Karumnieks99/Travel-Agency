import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  base: "/Travel-Agency/",
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        platform: resolve(__dirname, "platform.html"),
        support: resolve(__dirname, "support.html"),
      },
    },
  },
});
