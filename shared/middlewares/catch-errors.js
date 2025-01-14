exports.catchErrors = (middleware) => {
  return async (req, res, next) => {
    try {
      await middleware(req, res, next);
    } catch (err) {
      console.log(err);
      next(err);
    }
  };
};
