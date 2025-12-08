# Flowgear Sample App

React + TypeScript app that is always embedded inside the Flowgear Console. All data access goes through the Flowgear SDK, and the dev server is wired to open the console in debug mode automatically.

## Tech stack (current)
- React 19.1 + React DOM 19.1 with the React Compiler enabled
- Vite 7.1 (TypeScript 5.9) with `@vitejs/plugin-react` and `@vitejs/plugin-basic-ssl`
- Flowgear SDK: `flowgear-webapp@1.4.3` (`Flowgear.Sdk.invoke`, `init`, `setAlert`, etc.)
- UI: Bootstrap 5.3.8 and Sass
- Linting: ESLint 9.x (see `eslint.config.js`)

## API usage
- Call workflows via `Flowgear.Sdk.invoke(method, relativePath, payload?, headers?, tenant?)`.
- Discover available endpoints in `openapi.yml`, but ignore `servers`, `components`, and `security`; only the method and relative URL are passed to `invoke`.
- Do not call APIs directly with `fetch`/`axios` because the console provides the auth cookie on your behalf.

## Local development
1. Set `.env.local` values:
   - `FG_DEV_TENANT` and `FG_DEV_SITE` (required)
   - Optional: `FG_DEV_PROTOCOL` (`https` default), `FG_DEV_HOST` (`localhost`), `FG_DEV_PORT` (`3000`)
2. Install and run:
   ```bash
   npm install
   npm run dev
   ```
3. The dev server starts on a self-signed HTTPS host and opens two tabs:
   - Local app URL (accept the certificate)
   - Flowgear Console debug URL: `https://app.flowgear.net/#t-{tenant}/sites/{site}/apps/debug/?debugUrl={encoded-local-url}`

## Publishing checklist
- Update `public/app.json` (manifest, embed mode, menu placement) and bump `Version`.
- Provide the icon at `public/icon.svg`.
- Build and package: `npm run build`, then zip the `build` directory contents for upload.

## Recommended extensions & tooling
- ESLint (VS Code extension) to surface lint feedback from the existing config.
- Codex (CLI or VS Code extension) to develop with the guidance in `AGENTS.md` and keep API calls routed through `Flowgear.Sdk.invoke`.
