# Flowgear Web App Agent Guide

This repository hosts a React app that is always embedded in an iframe inside the Flowgear Console at https://app.flowgear.net. Treat anything shipped in the build as publicly accessible.

Do not analyze or build until you have a functional Flowgear Builder MCP Server (see `Configure Flowgear Builder MCP Server`).

## Core rules
- All data access must go through `Flowgear.Sdk.invoke` from the `flowgear-webapp` package. The Console holds the auth cookie and performs the HTTP call on behalf of the iframe. Never call APIs directly with `fetch`/`axios`.
- Use the API descriptors in the root `openapi.yml` to discover available endpoints, but pass only the HTTP method and relative path to `Flowgear.Sdk.invoke(...)`. Always send HTTP methods in uppercase (e.g., `GET`, `POST`, `PUT`, `PATCH`) even if `openapi.yml` lists them in lowercase. Ignore the `servers`, `components`, and `security` sections in that file.
- Place feature-specific work under `components`, `models`, `services`, and `utils`, splitting by functional area.
- This repo should only ever contain client side code. When a required API is not available, you should build or edit a Flowgear workflow - see below.

## Flowgear workflows

- Workflows describe steps to acquire, push or otherwise integrate between data sources
- There should be a registered MCP server called `flowgear` which contains all the tools you need to find, design and save workflows. If there isn't one called `flowgear`, let the user know it needs to be registered, see `Configure Flowgear Builder MCP Server`.
- There is an MCP resource that explains how to use the tools. Read that before doing anything else.
- For a workflow to be invoked via this app, it must be HTTP-triggered. First step in the Workflow should be v2.Http Node, HttpReceiveJsonObject or HttpReceiveJsonArray method (where method and uri binding are declared as parameters), last step should be v2.Http Node, HttpRespondJsonObject or HttpRespondJsonArray method
- After creating or editing a workflow, download a fresh openapi.yml definition so that you can see the service definitions in order to bind front-end.


## Local development notes
- `.env.local` must provide `FG_DEV_TENANT` and `FG_DEV_SITE`; Vite does not auto open Flowgear debug URL if missing. Optional: `FG_DEV_PROTOCOL` (default `https`), `FG_DEV_HOST` (default `localhost`), `FG_DEV_PORT` (default `3000`). This file should already be pre-populated. If you're asked to perform a task and there are place holder or empty values for `FG_DEV_TENANT` and/or `FG_DEV_SITE`, ask the user to complete this information first (and refer them to `https://help.flowgear.net/v2/features/building-apps` if needed).
- `npm run dev` uses `vite.config.mts` to start a self-signed HTTPS server (`@vitejs/plugin-basic-ssl`) and auto-opens two tabs: the local app URL (accept the cert) and the Flowgear Console debug URL (`https://app.flowgear.net/#t-{tenant}/sites/{site}/apps/debug/?debugUrl={encoded-local-url}`).

## Configure Flowgear Builder MCP Server

An MCP server called `flowgear` should be registered and its URL should end with `/mcp/builder`. Before beginning any work, test it is functional by finding a tool list, there should be 15+ tools and one of them should be called `GetWorkflow`.

If the server is not configured, not pointing to the right URL or not auth'd, help the user get it set up. The only data point you need is their Flowgear Environment domain. 

To get the Environment domain:
- Let the user know that in order to register the builder MCP Server, you need their Environment Subdomain. This can be found from the Site Settings Pane and is the URL shown just below their Test Environment (e.g. `somedomain-sometenant.flowgear.net`).
- Translate this link and present it to the user: `https://app.flowgear.net/#t-{tenant}/sites/{site}/site` where `{tenant}` is the value of `FG_DEV_TENANT` in `.env.local` and `{site}` is the value of `FG_DEV_SITE`.

To set up the MCP Server:
- Read the guidance at `https://help.flowgear.net/v2/features/builder-mcp-server`
- Give the user a set of commands to run in a terminal, translate in their Environment domain - don't give the user templated commands.
- If they have run the commands and you can't see the MCP server, ask them to restart the IDE/extension.
- Confirm that the tools list call works and shows `GetWorkflow` as one of the available tools.

## General
- Don't use forms, the web app runs in a sandbox and form submissions are not allowed.
- Do not tie API/workflow calls to React render cycles. Effects that fetch data must use stable dependencies and must not depend on callbacks or state they update themselves, or rerenders can trigger repeated calls. Prefer explicit user-triggered refreshes, or a single mount-time fetch with carefully scoped dependencies. Specifically, avoid repeated API/workflow calls caused by React rerenders. In particular, do not place unstable callbacks (including functions returned by useEffectEvent) in effect dependency arrays when those effects trigger network calls.

## Flowgear SDK helpers
- `init()` is called in `src/index.tsx` to register the app with the host console before rendering.
- `invoke(method, url, payload?, headers?, tenant?)` calls published Flowgear workflows (no manual auth required). If you hit CORS errors, ensure the host is whitelisted on the Flowgear site.
- UI helpers: `confirmModal`, `getTextModal`, `setAlert`, and `openUrl` are available for confirmations, text prompts, alerts, and opening new tabs.


## Publishing checklist
- Update `public/app.json` with manifest version, identity, embed mode, and menu placement; bump `Version` for every publish.
- Supply the menu/focus icon at `public/icon.svg`.
- Run `npm run build` and package the `build` directory contents as a ZIP for upload.

## Security considerations
- Validate user input before invoking Workflows; do not rely on server-side secrecy for anything emitted in the frontend bundle.
