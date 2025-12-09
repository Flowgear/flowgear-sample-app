import { Flowgear } from "flowgear-webapp";
import { Contact } from "../models/contacts";

interface ContactsResponse {
  Result?: {
    Table?: Contact[];
  };
}

export async function getContacts(): Promise<Contact[]> {
  const response = (await Flowgear.Sdk.invoke(
    "GET",
    "/webinars/apps/sql-contacts"
  )) as ContactsResponse;

  const contacts = response?.Result?.Table;

  if (!Array.isArray(contacts)) {
    throw new Error("Unexpected response format when loading contacts.");
  }

  return contacts;
}

export async function updateContact(contact: Contact): Promise<void> {
  await Flowgear.Sdk.invoke("POST", "/webinars/apps/sql-contacts", contact);
}
