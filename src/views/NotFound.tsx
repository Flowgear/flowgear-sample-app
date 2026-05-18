import { useLocation } from "react-router-dom";

export default function NotFound() {
  const location = useLocation();

  return (
    <div className="page-section">
      <h2>Not Found</h2>
      <p>
        Route <code>{location.pathname}</code> is not defined. Try{" "}
        <code>#/</code>, <code>#/customers</code>, or{" "}
        <code>#/settings</code>.
      </p>
    </div>
  );
}
