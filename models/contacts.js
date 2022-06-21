const fs = require("fs/promises");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const contactsPath = path.join(__dirname, "./contacts.json");

const listContacts = async () => {
  const data = await fs.readFile(contactsPath, "utf8");
  return data || null;
};

const getContactById = async (contactId) => {
  const data = await fs.readFile(contactsPath, "utf8");
  const contact = JSON.parse(data).find(({ id }) => id === contactId);
  return contact;
};

const removeContact = async (contactId) => {
  const data = await fs.readFile(contactsPath, "utf8");
  const contacts = JSON.parse(data);
  const newContactList = JSON.stringify(
    contacts.filter(({ id }) => id !== contactId)
  );

  fs.writeFile(contactsPath, newContactList);
};

const addContact = async (body) => {
  const data = await fs.readFile(contactsPath, "utf8");
  const contacts = JSON.parse(data);
  const newContact = {
    id: uuidv4(),
    ...body,
  };

  contacts.push(newContact);
  fs.writeFile(contactsPath, JSON.stringify(contacts));
  return newContact;
};

const updateContact = async (contactId, body) => {
  const data = await fs.readFile(contactsPath, "utf8");
  const contacts = JSON.parse(data);
  const newContactList = JSON.stringify(
    contacts.map((contact) => {
      if (contact.id === contactId) {
        return (contact = { ...contact, ...body });
      } else {
        return contact;
      }
    })
  );

  fs.writeFile(contactsPath, newContactList);
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
