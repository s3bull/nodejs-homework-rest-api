const express = require("express");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
} = require("../../contacts/contacts.service");
const {
  contactSchema,
  updContactSchema,
  schemaUpdateFavorite,
} = require("../../contacts/contacts.schema");
const {
  serializeContactResponse,
} = require("../../contacts/contacts.serializers");
const { catchErrors } = require("../../shared/middlewares/catch-errors");
const { validate } = require("../../shared/middlewares/validate");
const { authorize } = require("../../shared/middlewares/autorize");
const router = express.Router();

router.get(
  "/",
  authorize(),
  catchErrors(async (req, res, next) => {
    let { page = 1, limit = 20, favorite = [true, false] } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const contacts = await listContacts(req.userId, skip, limit, favorite);
    res.status(200).send(contacts);
  })
);

router.get(
  "/:contactId",
  authorize(),
  catchErrors(async (req, res, next) => {
    const contact = await getContactById(req.params.contactId, req.userId);
    if (!contact) res.status(404).send({ message: "Not found" });
    res.status(200).send(serializeContactResponse(contact));
  })
);

router.post(
  "/",
  authorize(),
  validate(contactSchema),
  catchErrors(async (req, res, next) => {
    const contact = await addContact(req.body, req.userId);
    res.status(201).send(contact);
  })
);

router.delete(
  "/:contactId",
  authorize(),
  catchErrors(async (req, res, next) => {
    const check = await getContactById(req.params.contactId, req.userId);
    console.log(check);
    if (!check) res.status(404).send({ message: "Not found" });
    await removeContact(req.params.contactId);
    res.status(200).send({ message: "contact deleted" });
  })
);

router.put(
  "/:contactId",
  authorize(),
  validate(updContactSchema),
  catchErrors(async (req, res, next) => {
    const check = await getContactById(req.params.contactId, req.userId);
    if (!check) res.status(404).send({ message: "Not found" });
    const contact = req.body;
    await updateContact(req.params.contactId, req.body);
    res.status(200).send(serializeContactResponse(contact));
  })
);

router.patch(
  "/:contactId/favorite",
  authorize(),
  validate(schemaUpdateFavorite),
  catchErrors(async (req, res, next) => {
    const check = await getContactById(req.params.contactId, req.userId);
    if (!check) res.status(404).send({ message: "Not found" });
    const contact = await updateStatusContact(req.params.contactId, req.body);
    res.status(200).send({ message: contact });
  })
);

module.exports = router;
