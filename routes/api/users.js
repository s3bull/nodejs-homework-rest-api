const { Router } = require("express");
const fs = require("fs").promises;
const path = require("path");
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
  updateAvatar,
} = require("../../auth/auth.service");
const { authorize } = require("../../shared/middlewares/autorize");
const { catchErrors } = require("../../shared/middlewares/catch-errors");
const { upload } = require("../../shared/middlewares/upload");
const { validate } = require("../../shared/middlewares/validate");
const Jimp = require("jimp");

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

router.patch(
  "/avatars",
  authorize(),
  upload.single("avatar"),
  catchErrors(async (req, res, next) => {
    await Jimp.read(req.file.path)
      .then((avatar) => {
        return avatar.resize(250, 250).write(path.join("/public/avatars"));
      })
      .catch((err) => {
        console.error(err);
      });

    try {
      const resultUpload = path.join(
        path.join("./public/avatars"),
        req.file.filename
      );
      await fs.rename(req.file.path, resultUpload);
      const avatarURL = path.join("avatars", req.file.filename);
      const user = await updateAvatar(req.userId, avatarURL);

      res.status(200).json(serializeUserResponse(user));
    } catch (error) {
      await fs.unlink(req.file.path);
      return next(error);
    }
  })
);

module.exports = router;
