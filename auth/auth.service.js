const { Conflict, Unauthorized, NotFound } = require("http-errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { AuthModel } = require("./auth.model");
const gravatar = require("gravatar");
const { v4: uuidv4 } = require("uuid");
const sendEmail = require("../shared/sendEmail");

const signUp = async (params) => {
  const { email, username, password } = params;

  const existingUser = await AuthModel.findOne({ email });
  if (existingUser) {
    throw new Conflict("User with such email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email, { s: "200", r: "pg", d: "404" });
  const verificationToken = uuidv4();
  const msg = {
    to: email,
    subject: "Verify your email",
    html: `<h1>Verify your email</h1>
    <p>Please verify your email by clicking the link below:</p>
    <a href="${process.env.FRONTEND_URL}/api/users/verify/${verificationToken}">
      Verify your email
    </a>`,
  };

  await sendEmail(msg);

  const user = await AuthModel.create({
    email,
    username,
    password: passwordHash,
    avatarURL,
    verificationToken,
  });

  return user;
};

const signIn = async (params) => {
  const { email, password } = params;
  const user = await AuthModel.findOne({ email });

  if (
    !user ||
    !(await bcrypt.compare(password, user.password)) ||
    !user.verify
  ) {
    throw new Unauthorized(
      "Email or password is wrong or user is not verified"
    );
  }

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

  const loginUser = await AuthModel.findByIdAndUpdate(
    user._id,
    { token },
    { new: true }
  );

  return loginUser;
};

const logout = async (userId) => {
  const user = await AuthModel.findById(userId);
  if (!user) {
    throw new Unauthorized("Not authorized");
  }

  return await AuthModel.findByIdAndUpdate(userId, { token: null });
};

const getCurrentUser = async (userId) => {
  const user = await AuthModel.findById(userId);
  if (!user) {
    throw new NotFound("User not found");
  }

  return user;
};

const updateSubscription = async (userId, subscription) => {
  const user = await AuthModel.findById(userId);

  if (!user) {
    throw new Unauthorized("Not authorized");
  }

  return await AuthModel.findByIdAndUpdate(
    userId,
    { subscription },
    { new: true }
  );
};

const updateAvatar = async (userId, avatarURL) => {
  const user = await AuthModel.findById(userId);

  if (!user) {
    throw new Unauthorized("Not authorized");
  }

  return await AuthModel.findByIdAndUpdate(
    userId,
    { avatarURL },
    { new: true }
  );
};

const verifyEmail = async (verificationToken) => {
  const user = await AuthModel.findOne({ verificationToken });

  if (!user) {
    throw new NotFound("User not found");
  }

  return await AuthModel.findByIdAndUpdate(
    user._id,
    { verify: true, verificationToken: null },
    { new: true }
  );
};

const resendingEmail = async (email) => {
  const user = await AuthModel.findOne({ email });

  if (!user) {
    throw new NotFound("User not found");
  }

  if (user.verify) {
    throw new Conflict("User is already verified");
  }

  const msg = {
    to: user.email,
    subject: "Verify your email",
    html: `<h1>Verify your email</h1>
    <p>Please verify your email by clicking the link below:</p>
    <a href="${process.env.FRONTEND_URL}/api/users/verify/${user.verificationToken}">
      Verify your email
    </a>`,
  };

  await sendEmail(msg);
};

module.exports = {
  signUp,
  signIn,
  logout,
  getCurrentUser,
  updateSubscription,
  updateAvatar,
  verifyEmail,
  resendingEmail,
};
