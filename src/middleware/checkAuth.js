const { verify } = require("jsonwebtoken");
const { UNAUTHORIZED } = require("../../utils/responseHelper");

exports.auth = (req, res, next) => {
  try {
    req.payload = verify(req.headers.authorization.split(" ")[1], process.env.SECRET);
    next();
  } catch (error) {
    UNAUTHORIZED(res, [], "Token Not Verified");
  }
};
