import { useLocation } from "react-router-dom";

export default function RouteDebug() {
  const location = useLocation();

  return (
    <div className="route-debug">
      <h3>Route debug</h3>
      <div>
        <strong>Current Path:</strong> {location.pathname}
      </div>
      <div>
        <strong>Raw Hash:</strong> {window.location.hash || "(empty)"}
      </div>
    </div>
  );
}
