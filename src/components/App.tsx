import { useEffect, useState } from "react";
import type { BasicWebAppResponse } from "../models/basicWebApp";
import type { HashRouteState } from "../models/routing";
import { getBasicWebAppData } from "../services/basicWebAppService";
import { createHashRoute, parseHashRoute } from "../utils/hashRouting";

function HomePage({
  onNavigate,
}: {
  onNavigate: (path: string, query?: Record<string, string>) => void;
}) {
  return (
    <div className="page-section">
      <h2>Home</h2>
      <p>
        This app uses the URL hash for routing inside the iframe. The parent
        can set the iframe URL with hashes like <code>#/customers</code> or{" "}
        <code>#%2Fcustomers%3Fstatus%3Dactive</code>.
      </p>
      <div className="button-row">
        <button
          className="btn btn-command btn-command-text"
          onClick={() => {
            onNavigate("/customers", { status: "active", source: "home" });
          }}
        >
          Open Active Customers
        </button>
        <button
          className="btn btn-command btn-command-text"
          onClick={() => {
            onNavigate("/settings", { tab: "profile" });
          }}
        >
          Open Settings
        </button>
      </div>
    </div>
  );
}

function CustomersPage({ routeState }: { routeState: HashRouteState }) {
  const statusFilter = routeState.query.status ?? "all";

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

function SettingsPage({ routeState }: { routeState: HashRouteState }) {
  return (
    <div className="page-section">
      <h2>Settings</h2>
      <p>
        Example tab from hash query: <strong>{routeState.query.tab ?? "general"}</strong>
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
        className="btn btn-command btn-command-text btn-command-emphasis refresh-button"
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

function App() {
  const [routeState, setRouteState] = useState<HashRouteState>(() =>
    parseHashRoute(window.location.hash),
  );
  const [refreshKey, setRefreshKey] = useState(0);
  const [data, setData] = useState<BasicWebAppResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onHashChange = () => {
      setRouteState(parseHashRoute(window.location.hash));
    };

    window.addEventListener("hashchange", onHashChange);

    return () => {
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  const navigateTo = (path: string, query?: Record<string, string>) => {
    const nextHash = createHashRoute(path, query);

    if (window.location.hash === nextHash) {
      return;
    }

    window.location.hash = nextHash;
  };

  useEffect(() => {
    if (routeState.route !== "workflow") {
      return;
    }

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
  }, [refreshKey, routeState.route]);

  return (
    <>
      <nav className="navbar navbar-fixed-top toolbar-container">
        <div className="command-container-center-controls route-nav">
          <button
            className={`btn btn-command btn-command-text ${
              routeState.route === "home" ? "btn-command-emphasis" : ""
            }`}
            onClick={() => navigateTo("/")}
          >
            Home
          </button>
          <button
            className={`btn btn-command btn-command-text ${
              routeState.route === "workflow" ? "btn-command-emphasis" : ""
            }`}
            onClick={() => navigateTo("/workflow")}
          >
            Workflow
          </button>
          <button
            className={`btn btn-command btn-command-text ${
              routeState.route === "customers" ? "btn-command-emphasis" : ""
            }`}
            onClick={() => navigateTo("/customers", { status: "active" })}
          >
            Customers
          </button>
          <button
            className={`btn btn-command btn-command-text ${
              routeState.route === "settings" ? "btn-command-emphasis" : ""
            }`}
            onClick={() => navigateTo("/settings", { tab: "general" })}
          >
            Settings
          </button>
        </div>
      </nav>

      <div className="app-contentarea">
        <div className="route-debug">
          <div>
            <strong>Current Path:</strong> {routeState.path}
          </div>
          <div>
            <strong>Raw Hash:</strong> {routeState.rawHash || "(empty)"}
          </div>
        </div>

        {routeState.route === "home" && <HomePage onNavigate={navigateTo} />}

        {routeState.route === "workflow" && (
          <WorkflowPage
            data={data}
            error={error}
            isLoading={isLoading}
            onRefresh={() => {
              setRefreshKey((currentValue) => currentValue + 1);
            }}
          />
        )}

        {routeState.route === "customers" && (
          <CustomersPage routeState={routeState} />
        )}

        {routeState.route === "settings" && (
          <SettingsPage routeState={routeState} />
        )}

        {routeState.route === "not-found" && (
          <div className="page-section">
            <h2>Not Found</h2>
            <p>
              Route <code>{routeState.path}</code> is not defined. Try{" "}
              <code>#/</code>, <code>#/workflow</code>, <code>#/customers</code>, or{" "}
              <code>#/settings</code>.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
