const { ContactsModel } = require("./contacts.model");

const listContacts = async (owner, skip, limit, favorite) => {
  const data = await ContactsModel.find({ owner, favorite })
    .skip(skip)
    .limit(limit);

  return data || null;
};

const getContactById = async (contactId, owner) => {
  const contact = await ContactsModel.findOne({ _id: contactId, owner });
  return contact;
};

const removeContact = async (contactId) => {
  await ContactsModel.deleteOne({ _id: contactId });
};

const addContact = async (body, owner) => {
  return ContactsModel.create({ ...body, owner });
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
