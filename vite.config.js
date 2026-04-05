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
        trip: resolve(__dirname, "trip.html"),
        support: resolve(__dirname, "support.html"),
        terms: resolve(__dirname, "terms.html"),
        cancellation: resolve(__dirname, "cancellation.html"),
        privacy: resolve(__dirname, "privacy.html"),
        payments: resolve(__dirname, "payments.html"),
      },
    },
  },
});
