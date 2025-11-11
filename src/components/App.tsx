import { useState } from "react";

function App() {
  const [refreshData, setRefreshData] = useState(false);

  return (
    <>
      <nav className="navbar navbar-fixed-top toolbar-container">
        <div className="command-container-center-controls">
          <button
            className="btn btn-command btn-command-text btn-command-emphasis refresh-button"
            onClick={() => {
              setRefreshData(!refreshData);
            }}
          >
            Refresh
          </button>
        </div>
      </nav>

      <div className="app-contentarea">
        {"Hello world!"}
      </div> 
    </>
  );
}

export default App;
