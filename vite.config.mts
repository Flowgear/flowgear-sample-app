import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";

const FLOWGEAR_CONSOLE_BASE = "https://app.flowgear.net";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const tenant = env.FG_TENANT ?? process.env.FG_TENANT ?? "";
  const site = env.FG_SITE ?? process.env.FG_SITE ?? "";
  const missing = [];

  if (!tenant) {
    missing.push("FG_TENANT");
  }

  if (!site) {
    missing.push("FG_SITE");
  }

  if (missing.length) {
    throw new Error(
      `[flowgear-sample-app] Missing ${missing.join(
        " and ",
      )}. Create an .env.local file (ignored by git) containing FG_TENANT and FG_SITE values supplied by Flowgear.`,
    );
  }

  const devProtocol = env.FG_DEV_PROTOCOL ?? "https";
  const devHost = env.FG_DEV_HOST ?? "localhost";
  const rawDevPort = Number(env.FG_DEV_PORT ?? "3000");
  const devPort = Number.isNaN(rawDevPort) ? 3000 : rawDevPort;
  const localAppUrl = `${devProtocol}://${devHost}${devPort ? `:${devPort}` : ""}`;
  const flowgearUrl = `${FLOWGEAR_CONSOLE_BASE}/#t-${tenant}/sites/${site}/apps/debug/?debugUrl=${encodeURIComponent(
    localAppUrl,
  )}`;

  return {
    base: "./",
    plugins: [react(), basicSsl()],
    server: {
      allowedHosts: true,
      host: devHost,
      port: devPort,
      cors: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      open: flowgearUrl,
    },
  };
});
