import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Flowgear } from "../flowgearSdk";
import BackButton from "../components/BackButton";
import RouteButton from "../components/RouteButton";
import RouteDebug from "../components/RouteDebug";
import Customers from "./Customers";
import Home from "./Home";
import NotFound from "./NotFound";
import Settings from "./Settings";

export default function App() {
  const location = useLocation();

  useEffect(() => {
    const currentPath = `${location.pathname}${location.search}`;
    void Flowgear.Sdk.setParentPath(currentPath);
  }, [location.pathname, location.search]);

  return (
    <>
      <nav className="navbar navbar-fixed-top toolbar-container route-nav">
        <div className="route-nav-left">
          <BackButton />
        </div>
        <div className="route-nav-center">
          <RouteButton
            label="Home"
            to="/"
            isActive={location.pathname === "/"}
          />
          <RouteButton
            label="Customers"
            to="/customers?status=inactive"
            isActive={location.pathname === "/customers"}
          />
          <RouteButton
            label="Settings"
            to="/settings?tab=general"
            isActive={location.pathname === "/settings"}
          />
        </div>
      </nav>

      <div className="app-contentarea">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <RouteDebug />
      </div>
    </>
  );
}
