import { useEffect, useState } from "react";
import { Contact } from "../models/contacts";
import { getContacts, updateContact } from "../services/contactsService";

interface ContactsTableProps {
  refreshKey: number;
}

function ContactsTable({ refreshKey }: ContactsTableProps) {
  const [rows, setRows] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());
  const [rowMessages, setRowMessages] = useState<Record<string, string>>({});

  useEffect(() => {
    let isActive = true;

    const loadContacts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getContacts();
        if (!isActive) {
          return;
        }
        setRows(response);
        setRowMessages({});
        setSavingIds(new Set());
      } catch (err) {
        if (!isActive) {
          return;
        }
        const message =
          err instanceof Error
            ? err.message
            : "Failed to load contacts from workflow.";
        setError(message);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadContacts();

    return () => {
      isActive = false;
    };
  }, [refreshKey]);

  const handleChange = (
    id: string,
    field: keyof Contact,
    value: string
  ) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
    setRowMessages((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleSubmit = async (id: string) => {
    const row = rows.find((item) => item.id === id);
    if (!row) {
      return;
    }

    setSavingIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    setRowMessages((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

    try {
      await updateContact(row);
      setRowMessages((prev) => ({
        ...prev,
        [id]: "Saved",
      }));
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to submit contact update.";
      setRowMessages((prev) => ({
        ...prev,
        [id]: `Error: ${message}`,
      }));
    } finally {
      setSavingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  if (loading) {
    return <div className="table-status">Loading contacts...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!rows.length) {
    return <div className="table-status">No contacts found.</div>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th className="text-align-left">First Name</th>
          <th className="text-align-left">Last Name</th>
          <th className="text-align-left">Company</th>
          <th className="text-align-left">Email</th>
          <th>Phone (Main)</th>
          <th>Phone (Alt)</th>
          <th className="text-align-left">City</th>
          <th>State</th>
          <th>Zip</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((contact) => (
          <tr key={contact.id}>
            <td>{contact.id}</td>
            <td className="text-align-left">
              <input
                className="form-control form-control-sm"
                value={contact.first_name}
                onChange={(e) =>
                  handleChange(contact.id, "first_name", e.target.value)
                }
              />
            </td>
            <td className="text-align-left">
              <input
                className="form-control form-control-sm"
                value={contact.last_name}
                onChange={(e) =>
                  handleChange(contact.id, "last_name", e.target.value)
                }
              />
            </td>
            <td className="text-align-left">
              <input
                className="form-control form-control-sm"
                value={contact.company_name}
                onChange={(e) =>
                  handleChange(contact.id, "company_name", e.target.value)
                }
              />
            </td>
            <td className="text-align-left">
              <input
                className="form-control form-control-sm"
                type="email"
                value={contact.email}
                onChange={(e) =>
                  handleChange(contact.id, "email", e.target.value)
                }
              />
            </td>
            <td>
              <input
                className="form-control form-control-sm"
                value={contact.phone1}
                onChange={(e) =>
                  handleChange(contact.id, "phone1", e.target.value)
                }
              />
            </td>
            <td>
              <input
                className="form-control form-control-sm"
                value={contact.phone}
                onChange={(e) =>
                  handleChange(contact.id, "phone", e.target.value)
                }
              />
            </td>
            <td className="text-align-left">
              <input
                className="form-control form-control-sm"
                value={contact.city}
                onChange={(e) =>
                  handleChange(contact.id, "city", e.target.value)
                }
              />
            </td>
            <td>
              <input
                className="form-control form-control-sm"
                value={contact.state}
                onChange={(e) =>
                  handleChange(contact.id, "state", e.target.value)
                }
              />
            </td>
            <td>
              <input
                className="form-control form-control-sm"
                value={contact.zip}
                onChange={(e) =>
                  handleChange(contact.id, "zip", e.target.value)
                }
              />
            </td>
            <td>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => handleSubmit(contact.id)}
                disabled={savingIds.has(contact.id)}
              >
                {savingIds.has(contact.id) ? "Submitting..." : "Submit"}
              </button>
              {rowMessages[contact.id] && (
                <div className="small" style={{ marginTop: "6px" }}>
                  {rowMessages[contact.id]}
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ContactsTable;
