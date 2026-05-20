import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Flowgear } from "flowgear-webapp";
import BackButton from "../components/BackButton";
import RouteButton from "../components/RouteButton";
import RouteDebug from "../components/RouteDebug";
import CustomersExample from "./Examples/CustomersExample";
import HomeExample from "./Examples/HomeExample";
import NotFoundExample from "./Examples/NotFoundExample";
import SettingsExample from "./Examples/SettingsExample";

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
            to="/customers-example?status=inactive"
            isActive={location.pathname === "/customers-example"}
          />
          <RouteButton
            label="Settings"
            to="/settings-example?tab=general"
            isActive={location.pathname === "/settings-example"}
          />
        </div>
      </nav>

      <div className="app-contentarea">
        <Routes>
          <Route path="/" element={<HomeExample />} />
          <Route path="/customers-example" element={<CustomersExample />} />
          <Route path="/settings-example" element={<SettingsExample />} />
          <Route path="/home-example" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundExample />} />
        </Routes>
        <RouteDebug />
      </div>
    </>
  );
}
