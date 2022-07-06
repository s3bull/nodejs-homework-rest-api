function serializeUser(user) {
  return {
    email: user.email,
    subscription: user.subscription,
  };
}

function serializeUserResponse(user) {
  return { user: serializeUser(user) };
}

function serializeSignIn(user) {
  return { user: serializeUser(user), token: user.token };
}

exports.serializeUserResponse = serializeUserResponse;
exports.serializeUser = serializeUser;
exports.serializeSignIn = serializeSignIn;
