import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="page-section">
      <h2>Home</h2>
      <p>Hello World!</p>
      <div className="button-row">
        <button
          className="basic-button"
          onClick={() => navigate("/customers-example?status=active&source=home")}
        >
          Open Active Customers
        </button>
        <button
          className="basic-button"
          onClick={() => navigate("/settings-example?tab=profile")}
        >
          Open Settings
        </button>
      </div>
    </div>
  );
}
