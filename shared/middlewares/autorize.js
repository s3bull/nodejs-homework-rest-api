const jwt = require("jsonwebtoken");
const { Unauthorized } = require("http-errors");

exports.authorize = () => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.replace("Bearer ", "");

    let payload;

    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return next(new Unauthorized());
    }

    req.userId = payload._id;
    next();
  };
};
