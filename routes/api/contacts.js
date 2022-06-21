const express = require("express");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../../models/contacts");
const {
  contactSchema,
  updContactSchema,
} = require("../../models/contacts.schema");
const {
  serializeContactResponse,
} = require("../../models/contacts.serializers");
const { catchErrors } = require("../../shared/middlewares/catch-errors");
const { validate } = require("../../shared/middlewares/validate");
const router = express.Router();

router.get(
  "/",
  catchErrors(async (req, res, next) => {
    const contacts = await listContacts();
    res.status(200).send(JSON.parse(contacts));
  })
);

router.get(
  "/:contactId",
  catchErrors(async (req, res, next) => {
    const contact = await getContactById(req.params.contactId);
    if (!contact) res.status(404).send({ message: "Not found" });
    res.status(200).send(serializeContactResponse(contact));
  })
);

router.post(
  "/",
  validate(contactSchema),
  catchErrors(async (req, res, next) => {
    await addContact(req.body);
    res.status(200).send(serializeContactResponse(req.body));
  })
);

router.delete(
  "/:contactId",
  catchErrors(async (req, res, next) => {
    const check = await getContactById(req.params.contactId);
    console.log(check);
    if (!check) res.status(404).send({ message: "Not found" });
    await removeContact(req.params.contactId);
    res.status(200).send({ message: "contact deleted" });
  })
);

router.put(
  "/:contactId",
  validate(updContactSchema),
  catchErrors(async (req, res, next) => {
    const check = await getContactById(req.params.contactId);
    if (!check) res.status(404).send({ message: "Not found" });
    const contact = req.body;
    await updateContact(req.params.contactId, req.body);
    res.status(200).send(serializeContactResponse(contact));
  })
);

module.exports = router;
