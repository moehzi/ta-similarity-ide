const jwt = require("jsonwebtoken");
const {
  JWT_SIGNATURE_KEY = "$2b$10$o/Um9jZOMZxohkDcSpmd7.2DPVB1GLYOo04rQdC3tc81WT2jzYTem",
} = process.env;

module.exports = function (req, res, next) {
  try {
    const payload = jwt.verify(req.headers["authorization"], JWT_SIGNATURE_KEY);
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({
      status: "FAIL",
      data: {
        name: "UNAUTHORIZED",
        message: err.message,
      }
    });
  }
};