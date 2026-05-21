import { useSearchParams } from "react-router-dom";

export default function CustomersExample() {
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
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-align-left">Contoso</td>
          </tr>
          <tr>
            <td className="text-align-left">Northwind</td>
          </tr>
          <tr>
            <td className="text-align-left">Fabrikam</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
