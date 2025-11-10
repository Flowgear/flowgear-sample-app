import fs from "fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    allowedHosts: true,
    port: 3000,
    cors: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    https: {
      key: fs.readFileSync("./certs/localhost-key.pem"),
      cert: fs.readFileSync("./certs/localhost-cert.pem"),
    },
  },
});
