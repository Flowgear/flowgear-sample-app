import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import "./index.scss";
import App from "./views/App.tsx";
// import { Flowgear } from "flowgear-webapp";
import { Flowgear } from "./flowgearSdk.ts"

Flowgear.Sdk.init();

createRoot(document.getElementById("root")!).render(
    <HashRouter>
        <App />
    </HashRouter>
);
