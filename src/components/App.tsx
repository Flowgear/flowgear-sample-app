import { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import type { BasicWebAppResponse } from "../models/basicWebApp";
import { getBasicWebAppData } from "../services/basicWebAppService";
import { Flowgear } from "../flowgearSdk";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="page-section">
      <h2>Home</h2>
      <p>
        This app uses the URL hash for routing inside the iframe. The parent
        can set the iframe URL with hashes like <code>#/customers</code> or{" "}
        <code>#/customers?status=active</code>.
      </p>
      <div className="button-row">
        <button
          className="basic-button"
          onClick={() => navigate("/customers?status=active&source=home")}
        >
          Open Active Customers
        </button>
        <button
          className="basic-button"
          onClick={() => navigate("/settings?tab=profile")}
        >
          Open Settings
        </button>
      </div>
    </div>
  );
}

function CustomersPage() {
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get("status") ?? "all";

  return (
    <div className="page-section">
      <h2>Customers</h2>
      <p>
        Status filter from hash query: <strong>{statusFilter}</strong>
      </p>
      <table>
        <thead>
          <tr>
            <th className="text-align-left">Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-align-left">Contoso</td>
            <td>Active</td>
          </tr>
          <tr>
            <td className="text-align-left">Northwind</td>
            <td>Inactive</td>
          </tr>
          <tr>
            <td className="text-align-left">Fabrikam</td>
            <td>Active</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function SettingsPage() {
  const [searchParams] = useSearchParams();

  return (
    <div className="page-section">
      <h2>Settings</h2>
      <p>
        Example tab from hash query: <strong>{searchParams.get("tab") ?? "general"}</strong>
      </p>
    </div>
  );
}

function WorkflowPage({
  data,
  error,
  isLoading,
  onRefresh,
}: {
  data: BasicWebAppResponse | null;
  error: string | null;
  isLoading: boolean;
  onRefresh: () => void;
}) {
  return (
    <div className="page-section">
      <h2>Workflow Data</h2>
      <button
        className="basic-button basic-button-primary refresh-button"
        onClick={onRefresh}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Refresh"}
      </button>

      {error && <div className="text-danger">{error}</div>}

      {!error && (
        <pre className="endpoint-response">{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  );
}

function RouteDebug() {
  const location = useLocation();

  return (
    <div className="route-debug">
      <div>
        <strong>Current Path:</strong> {location.pathname}
      </div>
      <div>
        <strong>Raw Hash:</strong> {window.location.hash || "(empty)"}
      </div>
    </div>
  );
}

function WorkflowRoute() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [data, setData] = useState<BasicWebAppResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getBasicWebAppData();

        if (!isCancelled) {
          setData(response);
        }
      } catch (requestError) {
        if (!isCancelled) {
          setData(null);
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Failed to load data from endpoint.",
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadData();

    return () => {
      isCancelled = true;
    };
  }, [refreshKey]);

  return (
    <WorkflowPage
      data={data}
      error={error}
      isLoading={isLoading}
      onRefresh={() => {
        setRefreshKey((currentValue) => currentValue + 1);
      }}
    />
  );
}

function NotFoundPage() {
  const location = useLocation();

  return (
    <div className="page-section">
      <h2>Not Found</h2>
      <p>
        Route <code>{location.pathname}</code> is not defined. Try{" "}
        <code>#/</code>, <code>#/workflow</code>, <code>#/customers</code>, or{" "}
        <code>#/settings</code>.
      </p>
    </div>
  );
}

function RouteButton({
  label,
  to,
  isActive,
}: {
  label: string;
  to: string;
  isActive: boolean;
}) {
  const navigate = useNavigate();

  return (
    <button
      className={`basic-button ${isActive ? "basic-button-primary" : ""}`}
      onClick={() => navigate(to)}
    >
      {label}
    </button>
  );
}

function App() {
  const location = useLocation();

  useEffect(() => {
    const currentPath = `${location.pathname}${location.search}`;
    void Flowgear.Sdk.setParentPath(currentPath);
  }, [location.pathname, location.search]);

  return (
    <>
      <nav className="navbar navbar-fixed-top toolbar-container">
        <div className="command-container-center-controls route-nav">
          <RouteButton label="Home" to="/" isActive={location.pathname === "/"} />
          <RouteButton
            label="Workflow"
            to="/workflow"
            isActive={location.pathname === "/workflow"}
          />
          <RouteButton
            label="Customers"
            to="/customers?status=active"
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
        <RouteDebug />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/workflow" element={<WorkflowRoute />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
