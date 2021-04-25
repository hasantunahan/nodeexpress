const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    const result = jwt.verify(token, "secretkey");
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = auth;
