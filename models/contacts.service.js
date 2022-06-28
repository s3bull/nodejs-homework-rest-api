const { ContactsModel } = require("./contacts");

const listContacts = async () => {
  const data = await ContactsModel.find();
  return data || null;
};

const getContactById = async (contactId) => {
  const contact = await ContactsModel.findById(contactId);
  return contact;
};

const removeContact = async (contactId) => {
  await ContactsModel.deleteOne({ _id: contactId });
};

const addContact = async (body) => {
  return ContactsModel.create(body);
};

const updateContact = async (contactId, body) => {
  return await ContactsModel.findByIdAndUpdate(contactId, body, { new: true });
};

const updateStatusContact = async (contactId, body) => {
  return await ContactsModel.findByIdAndUpdate(contactId, body, { new: true });
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
