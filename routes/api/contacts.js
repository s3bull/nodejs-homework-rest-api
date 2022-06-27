const express = require("express");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
} = require("../../models/contacts.service");
const {
  contactSchema,
  updContactSchema,
  schemaUpdateFavorite,
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
    res.status(200).send(contacts);
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
    const contact = await addContact(req.body);
    res.status(201).send(contact);
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

router.patch(
  "/:contactId/favorite",
  validate(schemaUpdateFavorite),
  catchErrors(async (req, res, next) => {
    const check = await getContactById(req.params.contactId);
    if (!check) res.status(404).send({ message: "Not found" });
    const contact = await updateStatusContact(req.params.contactId, req.body);
    res.status(200).send({ message: contact });
  })
);

module.exports = router;
