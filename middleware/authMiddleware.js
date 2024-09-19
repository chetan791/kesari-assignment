const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    try {
      const decode = jwt.verify(token, "kesari");
      if (decode) {
        req.body.userID = decode.userID
        next();
      } else {
        res.status(401).send({ msg: "Unauthorized" });
      }
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  } else {
    res.status(401).send({ msg: "please login" });
  }
};

module.exports = { auth };
