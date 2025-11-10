import { createRoot } from "react-dom/client";
import "./index.scss";
import App from "./components/App.tsx";
import { Flowgear } from "flowgear-webapp";

Flowgear.Sdk.init();

createRoot(document.getElementById("root")!).render(
    <App />
);
