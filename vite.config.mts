import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";
import { exec } from "child_process";

const FLOWGEAR_CONSOLE_BASE = "https://app.flowgear.net";

function openBrowser(url: string) {
    const cmd =
        process.platform === "win32"
            ? `start "" "${url}"`
            : process.platform === "darwin"
            ? `open "${url}"`
            : `xdg-open "${url}"`;
    exec(cmd);
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    const isDev = mode === "development";

    const tenant = env.FG_DEV_TENANT ?? "";
    const site = env.FG_DEV_SITE ?? "";

    const devProtocol = env.FG_DEV_PROTOCOL ?? "https";
    const devHost = env.FG_DEV_HOST ?? "localhost";
    const rawDevPort = Number(env.FG_DEV_PORT ?? "3000");
    const devPort = Number.isNaN(rawDevPort) ? 3000 : rawDevPort;
    const localAppUrl = `${devProtocol}://${devHost}${
        devPort ? `:${devPort}` : ""
    }`;

    const flowgearUrl =
        isDev && tenant && site
            ? `${FLOWGEAR_CONSOLE_BASE}/#t-${tenant}/sites/${site}/apps/debug/?debugUrl=${encodeURIComponent(
                  localAppUrl
              )}`
            : null;

    return {
        base: "./",
        plugins: [
            react(),
            basicSsl(),
            {
                name: "flowgear-dev-open",
                configureServer(server) {
                    let opened = false;
                    server.httpServer?.once("listening", () => {
                        if (opened || !isDev) return;
                        opened = true;

                        if (flowgearUrl) {
                            setTimeout(() => openBrowser(localAppUrl), 500);
                            setTimeout(() => openBrowser(flowgearUrl), 1500);

                            console.log(`
[Flowgear App] Two browser tabs are opening:

  1. ${localAppUrl}
     Accept the self-signed certificate here first

  2. Flowgear Console (debug mode)
     Your app will load here once the cert is accepted

If the app doesn't load in Flowgear, refresh after accepting the certificate.
`);
                        } else {
                            console.warn(
                                "[flowgear-sample-app] FG_DEV_TENANT and/or FG_DEV_SITE not set in .env.local. " +
                                    "Auto-open to Flowgear debug URL is disabled."
                            );
                        }
                    });
                },
            },
        ],
        server: {
            allowedHosts: true,
            host: devHost,
            port: devPort,
            cors: true,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
        },
    };
});
