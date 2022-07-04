const { Router } = require("express");
const { authSchema } = require("../../auth/auth.schema");
const {
  serializeUserResponse,
  serializeSignIn,
} = require("../../auth/auth.serializers");
const {
  signUp,
  signIn,
  getCurrentUser,
  logout,
  updateSubscription,
} = require("../../auth/auth.service");
const { authorize } = require("../../shared/middlewares/autorize");
const { catchErrors } = require("../../shared/middlewares/catch-errors");
const { validate } = require("../../shared/middlewares/validate");

const router = Router();

router.post(
  "/signup",
  validate(authSchema),
  catchErrors(async (req, res, next) => {
    const user = await signUp(req.body);
    res.status(201).send(serializeUserResponse(user));
  })
);

router.post(
  "/login",
  validate(authSchema),
  catchErrors(async (req, res, next) => {
    const result = await signIn(req.body);
    res.status(201).send(serializeSignIn(result));
  })
);

router.get(
  "/logout",
  authorize(),
  catchErrors(async (req, res, next) => {
    await logout(req.userId);
    res.status(204).json();
  })
);

router.get(
  "/current",
  authorize(),
  catchErrors(async (req, res, next) => {
    const user = await getCurrentUser(req.userId);
    res.status(200).send(serializeUserResponse(user));
  })
);

router.patch(
  "/",
  authorize(),
  catchErrors(async (req, res, next) => {
    const { subscription } = req.body;
    const subscriptionTypes = ["starter", "pro", "business"];

    if (!subscriptionTypes.includes(subscription)) {
      res.status(400).json({ message: "invalid subscription type" });
    }

    const user = await updateSubscription(req.userId, subscription);
    res.status(200).json(serializeUserResponse(user));
  })
);

module.exports = router;
