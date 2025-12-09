import { useState } from "react";
import ContactsTable from "./ContactsTable";

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <nav className="navbar navbar-fixed-top toolbar-container">
        <div className="command-container-center-controls">
          <button
            className="btn btn-command btn-command-text btn-command-emphasis refresh-button"
            onClick={() => setRefreshKey((key) => key + 1)}
          >
            Refresh
          </button>
        </div>
      </nav>

      <div className="app-contentarea">
        <h2>Contacts</h2>
        <p>Populated via the SQL Get Contacts workflow.</p>
        <ContactsTable refreshKey={refreshKey} />
      </div>
    </>
  );
}

export default App;
