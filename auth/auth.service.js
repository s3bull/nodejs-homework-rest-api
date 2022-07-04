const { Conflict, Unauthorized, NotFound } = require("http-errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { AuthModel } = require("./auth.model");

const signUp = async (params) => {
  const { email, username, password } = params;

  const existingUser = await AuthModel.findOne({ email });
  if (existingUser) {
    throw new Conflict("User with such email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await AuthModel.create({
    email,
    username,
    password: passwordHash,
  });

  return user;
};

const signIn = async (params) => {
  const { email, password } = params;
  const user = await AuthModel.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Unauthorized("Email or password is wrong");
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

module.exports = {
  signUp,
  signIn,
  logout,
  getCurrentUser,
  updateSubscription,
};
