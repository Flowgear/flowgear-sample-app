import { useEffect, useState } from "react";
import type { BasicWebAppResponse } from "../models/basicWebApp";
import { getBasicWebAppData } from "../services/basicWebAppService";

function App() {
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
    <>
      <nav className="navbar navbar-fixed-top toolbar-container">
        <div className="command-container-center-controls">
          <button
            className="btn btn-command btn-command-text btn-command-emphasis refresh-button"
            onClick={() => {
              setRefreshKey((currentValue) => currentValue + 1);
            }}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Refresh"}
          </button>
        </div>
      </nav>

      <div className="app-contentarea">
        {error && <div className="text-danger">{error}</div>}

        {!error && (
          <pre className="endpoint-response">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </>
  );
}

export default App;
