import { useSearchParams } from "react-router-dom";

export default function Settings() {
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
