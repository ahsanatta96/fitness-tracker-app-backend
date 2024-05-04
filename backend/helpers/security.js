var sanitize = require("mongo-sanitize");

const sanitizeData = (req, res, next) => {
  req.body = sanitize(req?.body);
  req.params = sanitize(req?.params);
  req.file = sanitize(req?.file);
  req.query = sanitize(req?.query);
  next();
};

module.exports = { sanitizeData };
