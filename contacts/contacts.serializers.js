function serializeContact(contact) {
  return {
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
  };
}

function serializeContactResponse(contact) {
  if (!contact) return;
  return { contact: serializeContact(contact) };
}

function serializeContactsListResponse(contacts) {
  return { contacts: contacts.map(serializeContact) };
}

exports.serializeContactResponse = serializeContactResponse;
exports.serializeContactsListResponse = serializeContactsListResponse;
